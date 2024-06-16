import {handler as getProductsHandler} from '../lambda_function_handlers/getProductByIdLambdaHandler';
import {ResponseI} from './types';
import {products} from "../utils/mockData";

const mockEventObj = {
  "pathParameters": {
    "id": "2"
  }
};

describe('Tests getProductByIdLambdaHandler function', () => {
  it('should work correctly', async () => {
    const response = await getProductsHandler(mockEventObj) as ResponseI;
    const result = JSON.parse(response.body)

    expect(result).toEqual(products[1])
  });

  it('should return 404 not found! if product doesnt exist', async () => {
    mockEventObj.pathParameters.id = "20";

    const response = await getProductsHandler(mockEventObj) as ResponseI;
    const parsedBody =  JSON.parse(response.body);

    expect(parsedBody.message).toEqual('Product not found!');
    expect(response.statusCode).toEqual(404);
  });
});
