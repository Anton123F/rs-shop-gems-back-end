import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export function createGetProductsFunction(scope: Construct, tableName: string, role: iam.IRole) {
  return new lambda.Function(scope, 'GetProducts', {
    runtime: lambda.Runtime.NODEJS_20_X,
    code: lambda.Code.fromAsset('dist'),
    handler: 'getProductsLambdaHandler-compiled.handler',
    role: role,
    environment: {
      TABLE_NAME: tableName
    }
  });
}