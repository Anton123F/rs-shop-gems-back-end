import * as apiGateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambdaIntegration from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cdk from 'aws-cdk-lib';

export function createImportProductsApi(stack: cdk.Stack, handlers: nodeJsLambda.NodejsFunction) {
  const api = new apiGateway.HttpApi(stack, 'importProductsApi');

  api.addRoutes({
    path: '/import',
    methods: [apiGateway.HttpMethod.GET],
    integration: new lambdaIntegration.HttpLambdaIntegration('importProductLambdaIntegration', handlers),
  });

  return api
}