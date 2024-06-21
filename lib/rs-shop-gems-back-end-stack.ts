import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lmbFunction from '../lambda/index';
import * as lmbApi from '../api/index';
import * as iam from 'aws-cdk-lib/aws-iam';
import {getEnvironmentTables} from "../utils/utils";

export class RsShopGemsBackEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const {PRODUCTS_TABLE, STOCKS_TABLE} = getEnvironmentTables();

    const LAMBDA_DEFAULT_ENVIRONMENT = {
      PRODUCTS_TABLE,
      STOCKS_TABLE
    }

    const productsTable =  cdk.aws_dynamodb.Table.fromTableName(this, 'ProductsDynamoDBTable', 'products');
    const stocksTable =  cdk.aws_dynamodb.Table.fromTableName(this, 'StocksDynamoDBTable', 'stocks');

    const role = new iam.Role(this, 'LambdaProductsGemsRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PartiQLSelect', 'dynamodb:PartiQLInsert', 'dynamodb:PutItem'],
      resources: [productsTable.tableArn, stocksTable.tableArn],
    }));

    const _getProductsFunction = lmbFunction.createGetProductsFunction(this, LAMBDA_DEFAULT_ENVIRONMENT, role);
    const _postProductsFunction = lmbFunction.createPostProductsFunction(this, LAMBDA_DEFAULT_ENVIRONMENT, role);
    const _getProductById = lmbFunction.createGetProductByIdFunction(this, LAMBDA_DEFAULT_ENVIRONMENT, role);

    lmbApi.createGetProductsApi(this, {
      getProductsId: _getProductById,
      getProducts: _getProductsFunction,
      postProducts: _postProductsFunction,
    });
  }
}
