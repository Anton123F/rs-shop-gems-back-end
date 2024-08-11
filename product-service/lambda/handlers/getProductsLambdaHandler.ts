import {HEADERS, REQUEST_METHODS, RESPONSE_MESSAGE} from "../../utils/constants";
import {getAllProducts} from "../../services/productsService";
import {DatabaseError} from "../../utils/customError";
import {groupTablesData} from "../../utils/utils";
import {getAllStocks} from "../../services/stocksService";

export const handler = async (event: any) => {
  console.log(event);
  try {
    const products = await getAllProducts();

    if (products?.length === 0) {
      return {
        statusCode: 404,
        headers: {...HEADERS, ...REQUEST_METHODS.GET},
        body: JSON.stringify(RESPONSE_MESSAGE.PRODUCT_NOT_FOUND),
      };
    }

    const stocks = await getAllStocks();
    const fullyDetailedProducts = groupTablesData(products, stocks);

    console.log(fullyDetailedProducts)

    return {
      statusCode: 200,
      headers: {...HEADERS, ...REQUEST_METHODS.GET},
      body: JSON.stringify(fullyDetailedProducts),
    };
  } catch (err: any) {
    if (err instanceof DatabaseError) {
      console.log(`database error`)
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

// handler({});