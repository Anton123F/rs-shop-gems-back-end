import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
export function createGetProductByIdFunction(scope: Construct) {
  return new lambda.Function(scope, 'GetProductById', {
    runtime: lambda.Runtime.NODEJS_20_X,
    code: lambda.Code.fromAsset('dist'),
    handler: 'getProductByIdLambdaHandler-compiled.handler',
  });
}