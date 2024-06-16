import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';

type lmbF = lambda.IFunction;

interface handlersI {
  getProducts: lmbF,
  getProductsId: lmbF
}
export function createGetProductsApi(scope: Construct, handlers: handlersI) {
  const api = new apigateway.RestApi(scope, 'GetProductsApi');

  const getProductsIntegration = new apigateway.LambdaIntegration(handlers.getProducts);
  const getProducts = api.root.addResource('products');
  getProducts.addMethod('GET', getProductsIntegration);

  const productByIdIntegration = new apigateway.LambdaIntegration(handlers.getProductsId);
  const productId = getProducts.addResource('{id}');
  productId.addMethod('GET', productByIdIntegration);

  return api;
}
