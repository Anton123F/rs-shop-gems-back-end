import {handler as getProductsByIdHandler} from '../lambda/handlers/getProductByIdLambdaHandler';
import {IProduct, ResponseI} from '../types/types';
import {RESPONSE_MESSAGE} from "../utils/constants";
import * as productService from "../services/productsService";
import {DatabaseError} from "../utils/customError";

const mockEventObj = {
  "pathParameters": {
    "id": "103"
  }
};

describe('Tests getProductByIdLambdaHandler function', () => {
  it('should return one product if product_id is valid and exist', async () => {
    const response = await getProductsByIdHandler(mockEventObj) as ResponseI;
    const result = JSON.parse(response.body) as IProduct[]
    expect(result.length).toEqual(1);
  });

  it('should return 404 not found! if product doesnt exist', async () => {
    mockEventObj.pathParameters.id = "-1";

    const response = await getProductsByIdHandler(mockEventObj) as ResponseI;
    const parsedBody = JSON.parse(response.body);

    expect(parsedBody.message).toEqual(RESPONSE_MESSAGE.PRODUCT_NOT_FOUND(mockEventObj.pathParameters.id).message);
    expect(response.statusCode).toEqual(404);
  });

  it('should return 500 status code and error message if something went wrong with dynamoDB', async () => {
    const errorMessageTextMock = 'error message';
    const getProductByIdSpy = jest.spyOn(productService, 'getProductById');

    getProductByIdSpy.mockImplementation(() => Promise.reject(new DatabaseError(errorMessageTextMock)));

    const response = await getProductsByIdHandler(mockEventObj) as ResponseI;
    const parsedBody = JSON.parse(response.body);

    expect(parsedBody.message).toEqual(errorMessageTextMock)
    expect(response.statusCode).toEqual(500);
  });
});
