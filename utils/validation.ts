import {number, object, string} from "yup";
import {IProduct, IStocks} from "../common/types";

const ProductSchema = object({
  id: string(),
  title: string().required().default(""),
  description: string().default(""),
  price: number().positive().required().defined().default(0),
});

const StockSchema = object({
  count: number().integer().min(0).required().defined().default(0),
  product_id: string(),
});

export const productValidation = async (product: IProduct) => {
  const productObj = {
    id: product.id.S,
    title: product.title.S,
    price: product.price.N,
    description: product.description.S,
  }

  await ProductSchema.validate(productObj);
};

export const stockValidation = async (stock: IStocks) => {
  const stockObj = {
    count: stock.count.N,
    product_id: stock.product_id.S
  }
  await StockSchema.validate(stockObj);
};