import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lmbFunction from '../lambda_functions/index';
import * as lmbApi from '../api_gateway/index';
import * as iam from 'aws-cdk-lib/aws-iam';
import {TABLES} from "../utils/constants";

export class RsShopGemsBackEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsTable =  cdk.aws_dynamodb.Table.fromTableName(this, 'ProductsDynamoDBTable', 'products');
    const stocksTable =  cdk.aws_dynamodb.Table.fromTableName(this, 'StocksDynamoDBTable', 'stocks');

    const role = new iam.Role(this, 'LambdaProductsGemsRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PartiQLSelect', 'dynamodb:PartiQLInsert', 'dynamodb:PutItem'],
      resources: [productsTable.tableArn, stocksTable.tableArn],
    }));

    const _getProductsFunction = lmbFunction.createGetProductsFunction(this, TABLES.products, role);
    const _postProductsFunction = lmbFunction.createPostProductsFunction(this, TABLES.products, role);
    const _getProductById = lmbFunction.createGetProductByIdFunction(this, TABLES.products, role);

    lmbApi.createGetProductsApi(this, {
      getProductsId: _getProductById,
      getProducts: _getProductsFunction,
      postProducts: _postProductsFunction,
    });
  }
}
