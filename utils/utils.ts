import {IFullProduct, IProduct, IStocks} from "../common/types";
import {TABLES} from "./constants";
import {TransactWriteItemsCommandInput} from "@aws-sdk/client-dynamodb";

export const groupTablesData = (mainTable: IProduct[], additionalTable: IStocks[]): IFullProduct[] => {
  const stocksLookup: { [key: string]: any } = {};
  additionalTable.forEach(stock => {
    stocksLookup[stock.product_id.S ] = stock;
  });

  return mainTable.map(product => {
    const stock = stocksLookup[product.id.S];
    return {
      id: product.id.S,
      title: product.title.S,
      price: product.price.N,
      count: stock ? stock.count.N : 0,
      description: product.description.S
    };
  });
}

export const generateRandomId = (length: number = 10) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const prepareParamObjectForPutTransaction = (product: IProduct, stock: IStocks): TransactWriteItemsCommandInput => {
  return {
    TransactItems: [
      {
        Put: {
          TableName: TABLES.products,
          Item: {
            id: {S: product.id.S},
            title: {S: product.title.S},
            price: {N: `${product.price.N}`},
            description: {S: product.description.S}
          }
        }
      },
      {
        Put: {
          TableName: TABLES.stocks,
          Item: {
            stocksId: {S: stock.stocksId.S},
            product_id: {S: stock.product_id.S},
            count: {N: `${stock.count.N}`},
          }
        }
      }
    ]
  };
}
