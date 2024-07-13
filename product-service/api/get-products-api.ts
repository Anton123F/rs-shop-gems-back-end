import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';

type lmbF = lambda.IFunction;

interface handlersI {
  getProducts: lmbF,
  getProductsId: lmbF,
  postProducts: lmbF,
}
export function createGetProductsApi(scope: Construct, handlers: handlersI) {
  const api = new apigateway.RestApi(scope, 'GetProductsApi');

  const products = api.root.addResource('products');

  const getProductsIntegration = new apigateway.LambdaIntegration(handlers.getProducts);
  products.addMethod('GET', getProductsIntegration);

  const postProductsIntegration = new apigateway.LambdaIntegration(handlers.postProducts);
  products.addMethod('POST', postProductsIntegration);

  const productByIdIntegration = new apigateway.LambdaIntegration(handlers.getProductsId);
  const productId = products.addResource('{id}');
  productId.addMethod('GET', productByIdIntegration);

  return api;
}
