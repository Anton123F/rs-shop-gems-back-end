import {HEADERS, REQUEST_METHODS, RESPONSE_MESSAGE} from "../utils/constants";
import {getProductById} from "../services/productsService";
import {DatabaseError} from "../utils/CustomError";
import {getStocksById} from "../services/stocksService";
import {groupTablesData} from "../utils/utils";

export const handler = async (event: any) => {
  console.log(event);
  const pathParameters = event.pathParameters;
  const {id: productId} = pathParameters;

  try {
    const products = await getProductById(productId);

    if (products?.length === 0) {
      return {
        statusCode: 404,
        headers: {...HEADERS, ...REQUEST_METHODS.GET},
        body: JSON.stringify(RESPONSE_MESSAGE.PRODUCT_NOT_FOUND(productId)),
      };
    }

    const stocks = await getStocksById(products[0].id.S);
    const fullyDescribedProduct = groupTablesData(products, stocks);

    return {
      statusCode: 200,
      headers: {...HEADERS, ...REQUEST_METHODS.GET},
      body: JSON.stringify(fullyDescribedProduct),
    };
  } catch (err: any) {
    if (err instanceof DatabaseError) {
      return {
        statusCode: 500,
        headers: {...HEADERS, ...REQUEST_METHODS.GET},
        body: JSON.stringify({message: err.message}),
      };
    } else {
      return {
        statusCode: 500,
        headers: {...HEADERS, ...REQUEST_METHODS.GET},
        body: JSON.stringify(err),
      };
    }
  }
};
