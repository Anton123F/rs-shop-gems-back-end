import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
import * as iam from "aws-cdk-lib/aws-iam";

export function createGetProductByIdFunction(scope: Construct, env: any, role: iam.IRole) {
  return new lambda.Function(scope, 'GetProductById', {
    runtime: lambda.Runtime.NODEJS_20_X,
    code: lambda.Code.fromAsset('dist'),
    handler: 'getProductByIdLambdaHandler-compiled.handler',
    role: role,
    environment: env
  });
}