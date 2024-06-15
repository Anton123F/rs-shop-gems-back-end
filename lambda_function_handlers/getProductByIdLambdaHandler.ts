import {products} from "../utils/mockData";
import * as utils from '../utils/constants';
export const handler = async (event: any) => {
  const pathParameters = event.pathParameters;
  const { id: productId } = pathParameters;
  const result = products.find(element => element.id === productId);

  if (result) {
    return {
      statusCode: 200,
      headers: {...utils.HEADERS, "Access-Control-Allow-Methods": "GET"},
      body: JSON.stringify(result),
    };
  }

  return {
    statusCode: 404,
    headers: {...utils.HEADERS, "Access-Control-Allow-Methods": "GET"},
    body: JSON.stringify({message: "Product not found!"}),
  };
};