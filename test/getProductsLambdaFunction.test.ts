import { handler as getProductsHandler } from '../lambda_function_handlers/getProductsLambdaHandler';
import { ResponseI } from './types';
import {products} from "../utils/mockData";

describe('Tests getProductsLambdaHandler', () => {
  it('should work correctly', async () => {
    const response = await getProductsHandler({}) as ResponseI;
    const a = JSON.parse(response.body)
    expect(a[1]).toEqual(products[1]);
  });
});
