import {IFullProduct, IProduct, IStocks} from "../types/types";

export const groupTablesData = (mainTable: IProduct[], additionalTable: IStocks[]): IFullProduct[] => {
  const stocksLookup: { [key: string]: any } = {};
  additionalTable.forEach(stock => {
    stocksLookup[stock.product_id ] = stock;
  });

  return mainTable.map(product => {
    const stock = stocksLookup[product.id];
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      count: stock ? stock.count : 0,
      description: product.description,
      imageURL: product.imageURL,
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

export const prepareParamObjectForPutTransaction = (product: IProduct, stock: IStocks, productsTable: string, stocksTable: string) => {
  return {
    TransactItems: [
      {
        Put: {
          TableName: productsTable,
          Item: product
        }
      },
      {
        Put: {
          TableName: stocksTable,
          Item: stock
        }
      }
    ]
  };
}

export const getEnvironmentTables = () => ({
    PRODUCTS_TABLE: process.env.PRODUCTS_TABLE_NAME || 'products',
    STOCKS_TABLE: process.env.STOCK_TABLE_NAME || 'stocks'
});