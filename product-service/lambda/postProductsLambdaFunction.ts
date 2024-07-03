import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export function createPostProductsFunction(scope: Construct, env: any, role: iam.IRole) {
  return new lambda.Function(scope, 'PostProducts', {
    functionName: 'PostProductsFunction',
    runtime: lambda.Runtime.NODEJS_20_X,
    code: lambda.Code.fromAsset('dist'),
    handler: 'postProductsLambdaHandler-compiled.handler',
    role: role,
    environment: env,
  });
}