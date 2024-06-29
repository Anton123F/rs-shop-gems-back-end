import {Construct} from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {aws_s3_notifications} from "aws-cdk-lib";

import {createImportProductsFile} from "../lambda/importProductsFileFunction";
import {createImportProductsApi} from "../api/import-service-api";
import {createImportFileParser} from "../lambda/importFileParserFunction";

const BUCKET = 'rs-module-anthony-backet-s3-import';

const DEFAULT_ENV = {
  IMPORT_BUCKET_NAME: BUCKET,
  REGION: 'us-east-1'
}

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketName(this, 'ImportBucket', BUCKET);

    const _importProductsLambdaFunction = createImportProductsFile(this, DEFAULT_ENV);
    const _importProductsFileParserFunction = createImportFileParser(this, DEFAULT_ENV);

    createImportProductsApi(this, _importProductsLambdaFunction);

    bucket.grantReadWrite(_importProductsLambdaFunction);
    bucket.grantReadWrite(_importProductsFileParserFunction);

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new aws_s3_notifications.LambdaDestination(_importProductsFileParserFunction),
      {prefix: 'uploaded/'}
    )
  }
}
