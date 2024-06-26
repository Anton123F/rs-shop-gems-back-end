import { handler as getProductsHandler } from '../lambda/handlers/getProductsLambdaHandler';
import { ResponseI } from '../types/types';

describe('Tests getProductsLambdaHandler', () => {
  it('should return list of all products', async () => {
    const response = await getProductsHandler({}) as ResponseI;
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.length).toBeGreaterThan(0);
  });
});