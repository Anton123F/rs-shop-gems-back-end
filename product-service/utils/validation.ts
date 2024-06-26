import {number, object, string} from "yup";
import {IProduct, IStocks} from "../types/types";

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
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
  }

  await ProductSchema.validate(productObj);
};

export const stockValidation = async (stock: IStocks) => {
  const stockObj = {
    count: stock.count,
    product_id: stock.product_id
  }
  await StockSchema.validate(stockObj);
};