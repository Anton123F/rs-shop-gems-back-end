import {Construct} from "constructs";
import {aws_s3_notifications} from "aws-cdk-lib";
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscription from 'aws-cdk-lib/aws-sns-subscriptions';
import * as EventSource from 'aws-cdk-lib/aws-lambda-event-sources';

import {createImportProductsFile} from "../lambda/importProductsFileFunction";
import {createImportProductsApi} from "../api/import-service-api";
import {createImportFileParser} from "../lambda/importFileParserFunction";
import {createCatalogBatchProcess} from "../lambda/catalogBatchProcessFunction";

import * as roles from './roles';

const BUCKET = 'rs-module-anthony-backet-s3-import';

const DEFAULT_ENV = {
  IMPORT_BUCKET_NAME: BUCKET,
  REGION: 'us-east-1'
}

const ENV_TABLES = {
  PRODUCTS_TABLE: 'products',
  STOCKS_TABLE: 'stocks'
}

const DEFAULT_QUEUE_BATCH_SIZE = 5;

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketName(this, 'ImportBucket', BUCKET);

    const itemsQueue = new sqs.Queue(this, 'catalogItemsQueue');
    const productTopicQueue = new sns.Topic(this, 'createProductTopic ', {
      displayName: 'Product Topic SNS Queue',
    });

    const productsTable = cdk.aws_dynamodb.Table.fromTableName(this, 'ProductsDynamoDbTable', ENV_TABLES.PRODUCTS_TABLE);
    const stocksTable = cdk.aws_dynamodb.Table.fromTableName(this, 'StocksDynamoDbTable', ENV_TABLES.STOCKS_TABLE);

    const _importProductsLambdaFunction = createImportProductsFile(this, DEFAULT_ENV);
    const _importProductsFileParserFunction = createImportFileParser(
      this,
      Object.assign(
        DEFAULT_ENV,
        {QUEUE_URL: itemsQueue.queueUrl}
      )
    );

    const catalogBatchProcessFunctionRole = roles.createCatalogBatchBatchProcessFunctionRole(this,[productsTable.tableArn, stocksTable.tableArn]);
    const _catalogBatchProcessFunction = createCatalogBatchProcess(
      this,
      Object.assign(
        DEFAULT_ENV,
        ENV_TABLES,
        {SNS_QUEUE_ARN: productTopicQueue.topicArn}
      ),
      catalogBatchProcessFunctionRole
    );

    createImportProductsApi(this, _importProductsLambdaFunction);

    bucket.grantReadWrite(_importProductsLambdaFunction);
    bucket.grantReadWrite(_importProductsFileParserFunction);

    itemsQueue.grantSendMessages(_importProductsFileParserFunction);
    itemsQueue.grantConsumeMessages(_catalogBatchProcessFunction);
    productTopicQueue.grantPublish(_catalogBatchProcessFunction);

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new aws_s3_notifications.LambdaDestination(_importProductsFileParserFunction),
      {prefix: 'uploaded/'}
    );

    _catalogBatchProcessFunction.addEventSource(new EventSource.SqsEventSource(itemsQueue, {
      batchSize: DEFAULT_QUEUE_BATCH_SIZE
    }));

    /**
     * case when all products wil be added to the tables
     */
    productTopicQueue.addSubscription(new snsSubscription.EmailSubscription('grimenotick@gmail.com', {
      filterPolicy: {
        successfullyAdded: sns.SubscriptionFilter.stringFilter({
          allowlist: ['true']
        }),
      }
    }));

    /**
     * personal notification with the condition of interest
     */
    productTopicQueue.addSubscription(new snsSubscription.EmailSubscription('antontaurus1@gmail.com', {
      filterPolicy: {
        price: sns.SubscriptionFilter.numericFilter({
          greaterThanOrEqualTo: 5000
        }),
      }
    }));
  }
}