import * as cdk from 'aws-cdk-lib';
import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Runtime} from "aws-cdk-lib/aws-lambda";

export function createCatalogBatchProcess(stack: cdk.Stack, env: { [key: string]: string }, role: iam.IRole): nodeJsLambda.NodejsFunction {
  return new nodeJsLambda.NodejsFunction(stack, 'catalogBatchProcess', {
    functionName: 'catalogBatchProcessFunction',
    runtime: Runtime.NODEJS_20_X,
    entry: 'lambda/handlers/catalogBatchProcessHandler.ts',
    handler: 'handler',
    environment: env,
    role
  })
}