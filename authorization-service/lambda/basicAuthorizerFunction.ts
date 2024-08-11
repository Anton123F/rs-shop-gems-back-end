import * as cdk from 'aws-cdk-lib';
import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from "aws-cdk-lib/aws-lambda";

export const createBasicAuthorizerFunction = (stack: cdk.Stack, env: { [key: string]: string }) => {
  return new nodeJsLambda.NodejsFunction(stack, 'basicAuthorizer', {
    functionName: 'basicAuthorizerFunction',
    runtime: Runtime.NODEJS_20_X,
    entry: 'lambda/handlers/basicAuthorizerHandler.ts',
    handler: 'handler',
    environment: env
  });
};