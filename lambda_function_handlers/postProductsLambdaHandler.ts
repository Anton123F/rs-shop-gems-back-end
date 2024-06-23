import {HEADERS, MESSAGES, REQUEST_METHODS} from "../utils/constants";
import {addNewProduct} from "../services/productsService";
import {
  generateRandomId,
  prepareParamObjectForPutTransaction
} from "../utils/utils";
import {DatabaseError} from "../utils/CustomError";
import {IProduct, IStocks} from "../common/types";
import {ValidationError} from 'yup';
import {productValidation, stockValidation} from "../utils/validation";

export const handler = async (event: any) => {
  console.log(event);
  const body = JSON.parse(event.body);
  const {title, price, description, count} = body;
  const productId = generateRandomId();

  const product: IProduct = {
    id: {S: productId},
    price: {N: price},
    title: {S: title},
    description: {S: description},
  };

  const stock: IStocks = {
    count: {N: count},
    product_id: {S: productId},
    stocksId: {S: generateRandomId()}
  }

  try {
    await productValidation(product);
    await stockValidation(stock);
    const params = prepareParamObjectForPutTransaction(product, stock);
    await addNewProduct(params);
    return {
      statusCode: 200,
      headers: {...HEADERS, ...REQUEST_METHODS.POST},
      body: JSON.stringify({message: MESSAGES.SUCCESS_ADDED_PRODUCT}),
    };
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: {...HEADERS, ...REQUEST_METHODS.POST},
        body: JSON.stringify({message: err.errors}),
      };
    } else if (err instanceof DatabaseError) {
      return {
        statusCode: 500,
        headers: {...HEADERS, ...REQUEST_METHODS.POST},
        body: JSON.stringify({message: err.message}),
      };
    } else {
      return {
        statusCode: 500,
        headers: {...HEADERS, ...REQUEST_METHODS.POST},
        body: JSON.stringify(err),
      };
    }
  }
};
