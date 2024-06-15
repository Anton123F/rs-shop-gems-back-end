import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';

import * as lmbFunction from '../lambda_functions/index';
import * as lmbApi from '../api_gateway/index';

export class RsShopGemsBackEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const _getProductsFunction = lmbFunction.createGetProductsFunction(this);
    const _getProductById = lmbFunction.createGetProductByIdFunction(this);

    lmbApi.createGetProductsApi(this, {
      getProductsId: _getProductById,
      getProducts: _getProductsFunction
    })
  }
}
