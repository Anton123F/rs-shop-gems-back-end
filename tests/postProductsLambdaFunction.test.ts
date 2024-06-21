import {handler as postProductsHandler} from '../lambda/handlers/postProductsLambdaHandler';
import {IProduct, ResponseI} from '../types/types';
import * as productService from "../services/productsService";
import {DatabaseError} from "../utils/customError";
import {MESSAGES} from "../utils/constants";


const mockBodyRequest = {
  count: 10,
  price: 10,
  title: 'tests title',
  description: 'tests description',
}

describe('Tests getProductsLambdaHandler', () => {
  afterEach(() => {
    mockBodyRequest.count = 10;
    mockBodyRequest.price = 10;
    mockBodyRequest.title = 'Example tests title';
    mockBodyRequest.description = 'tests description';
  });

  it('should thrown an error if something wrong with connection or DB', async () => {
    const errorText = "connection error";
    const getProductByIdSpy = jest.spyOn(productService, 'addNewProduct');
    getProductByIdSpy.mockImplementation(() => Promise.reject(new DatabaseError(errorText)));

    const response = await postProductsHandler({"body": JSON.stringify(mockBodyRequest)}) as ResponseI;
    const parsedBody = JSON.parse(response.body);

    expect(response.statusCode).toEqual(500);
    expect(parsedBody.message).toEqual(errorText);

  });

  it('should correctly validate "price" value', async () => {
    const getProductByIdSpy = jest.spyOn(productService, 'getProductById');
    getProductByIdSpy.mockImplementation(() => Promise.resolve({} as IProduct));
    mockBodyRequest.price = -100;
    const response = await postProductsHandler({"body": JSON.stringify(mockBodyRequest)}) as ResponseI;
    expect(response.statusCode).toEqual(400);
  });

  it('should correctly validate "title" value', async () => {
    const getProductByIdSpy = jest.spyOn(productService, 'getProductById');
    getProductByIdSpy.mockImplementation(() => Promise.resolve({} as IProduct));
    mockBodyRequest.title = "";
    const response = await postProductsHandler({"body": JSON.stringify(mockBodyRequest)}) as ResponseI;

    expect(response.statusCode).toEqual(400);
  });

  it('should add product to the table', async () => {
    const getProductByIdSpy = jest.spyOn(productService, 'addNewProduct');
    getProductByIdSpy.mockImplementation(() => Promise.resolve([]));

    const response = await postProductsHandler({"body": JSON.stringify({
        count: 1,
        price: 100,
        title: 'Some Title',
        description: 'Some description'
    })}) as ResponseI;

    const parsedBody = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(parsedBody.message).toEqual(MESSAGES.SUCCESS_ADDED_PRODUCT);
  });
});
