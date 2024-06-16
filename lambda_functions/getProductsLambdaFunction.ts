import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
export function createGetProductsFunction(scope: Construct) {
  return new lambda.Function(scope, 'GetProducts', {
    runtime: lambda.Runtime.NODEJS_20_X,
    code: lambda.Code.fromAsset('dist'),
    handler: 'getProductsLambdaHandler-compiled.handler',
  });
}