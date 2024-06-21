import {IProduct, ITables} from "../common/types";

const table_name = process.env.DYNAMODB_TABLE || 'products';

export const QUERY = {
  getAllData: (tableName: ITables) => `select * from ${tableName}`,
  getProductItemById: (id: string) => `select * from products where id='${id}'`,
  getStockItemById: (id: string) => `select * from stocks where product_id='${id}'`,
  addNewProduct: (product: IProduct) => {
    return `INSERT INTO ${table_name} value {'id':${product.id.S}, 'title':'${product.title.S}', 'price': ${product.price.N}}`
  }
}
