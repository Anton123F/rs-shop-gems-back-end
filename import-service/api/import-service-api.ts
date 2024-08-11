import * as apiGateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambdaIntegration from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export function createImportProductsApi(stack: cdk.Stack, handlers: nodeJsLambda.NodejsFunction) {
  const api = new apiGateway.HttpApi(stack, 'importProductsApi', {
    corsPreflight: {
      allowOrigins: ['https://d1r3jmz9mesihr.cloudfront.net'],
      allowMethods: [apiGateway.CorsHttpMethod.GET, apiGateway.CorsHttpMethod.POST],
      allowHeaders: ['Authorization'],
      maxAge: cdk.Duration.days(10),
    }
  });

  const _basicAuthorizerFunctionArn = cdk.Fn.importValue('BasicAuthorizerFunctionArn');

  const _basicAuthorizerFunction = lambda.Function.fromFunctionArn(stack, 'ImportedAuthorizerFunction', _basicAuthorizerFunctionArn);

  const _httpLambdaAuthorizer = new HttpLambdaAuthorizer('basicAuthorizer', _basicAuthorizerFunction, {
    responseTypes: [HttpLambdaResponseType.IAM]
  });

  api.addRoutes({
    path: '/import',
    methods: [apiGateway.HttpMethod.GET],
    integration: new lambdaIntegration.HttpLambdaIntegration('importProductLambdaIntegration', handlers),
    authorizer: _httpLambdaAuthorizer,
  });

  return api
}