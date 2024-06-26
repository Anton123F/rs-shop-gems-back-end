import * as cdk from 'aws-cdk-lib';
import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from "aws-cdk-lib/aws-lambda";

export function createImportFileParser(stack: cdk.Stack, env: { [key: string]: string }): nodeJsLambda.NodejsFunction {
  return new nodeJsLambda.NodejsFunction(stack, 'importFileParser', {
    runtime: Runtime.NODEJS_20_X,
    entry: 'lambda/handlers/importFileParserHandler.ts',
    handler: 'handler',
    environment: env
  })
}