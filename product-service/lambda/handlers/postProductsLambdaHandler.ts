import {HEADERS, MESSAGES, REQUEST_METHODS} from "../../utils/constants";
import {addNewProduct} from "../../services/productsService";
import {
  generateRandomId, getEnvironmentTables,
  prepareParamObjectForPutTransaction
} from "../../utils/utils";
import {DatabaseError} from "../../utils/customError";
import {IProduct, IStocks} from "../../types/types";
import {ValidationError} from 'yup';
import {productValidation, stockValidation} from "../../utils/validation";

export const handler = async (event: any) => {
  console.log(event);
  const body = JSON.parse(event.body);
  const { price, description, count, title} = body;
  const id = generateRandomId();
  const {PRODUCTS_TABLE, STOCKS_TABLE} = getEnvironmentTables();

  const product: IProduct = {
    id,
    price,
    title,
    description,
  };

  const stock: IStocks = {
    count,
    product_id: id,
    id: generateRandomId()
  }

  try {
    await productValidation(product);
    await stockValidation(stock);
    const params = prepareParamObjectForPutTransaction(product, stock, PRODUCTS_TABLE, STOCKS_TABLE);
    await addNewProduct(params);
    return {
      statusCode: 200,
      headers: {...HEADERS, ...REQUEST_METHODS.POST},
      body: JSON.stringify({message: MESSAGES.SUCCESS_ADDED_PRODUCT}),
    };
  } catch (err: any) {
    if (err instanceof ValidationError) {
      console.log(err.errors)
      return {
        statusCode: 400,
        headers: {...HEADERS, ...REQUEST_METHODS.POST},
        body: JSON.stringify({message: err.errors}),
      };
    } else if (err instanceof DatabaseError) {
      console.log(`data base error`);
      console.log(err)
      return {
        statusCode: 500,
        headers: {...HEADERS, ...REQUEST_METHODS.POST},
        body: JSON.stringify({message: err.message}),
      };
    } else {
      console.log(err)
      return {
        statusCode: 500,
        headers: {...HEADERS, ...REQUEST_METHODS.POST},
        body: JSON.stringify(err),
      };
    }
  }
};

// handler({
//   body: JSON.stringify({
//     title: 'Enot',
//     description: 'enot description',
//     price: 100,
//     count: 3
//   })
// })