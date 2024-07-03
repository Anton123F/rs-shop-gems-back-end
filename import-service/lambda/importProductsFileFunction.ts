import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';

export function createImportProductsFile(stack: cdk.Stack, env: {[key: string]: string}): nodeJsLambda.NodejsFunction {
  return new nodeJsLambda.NodejsFunction(stack, 'importProductsFile', {
    functionName: 'ImportProductFileFunction',
    runtime: Runtime.NODEJS_20_X,
    entry: 'lambda/handlers/importProductsFileHandler.ts',
    handler: 'handler',
    environment: env
  });
}