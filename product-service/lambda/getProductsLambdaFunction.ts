import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export function createGetProductsFunction(scope: Construct, env: any, role: iam.IRole) {
  return new lambda.Function(scope, 'GetProducts', {
    functionName: 'GetProductsFunction',
    runtime: lambda.Runtime.NODEJS_20_X,
    code: lambda.Code.fromAsset('dist'),
    handler: 'getProductsLambdaHandler-compiled.handler',
    role: role,
    environment: env,
  });
}