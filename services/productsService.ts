import {ExecuteStatementCommand, TransactWriteItemsCommandInput} from '@aws-sdk/client-dynamodb';
import {IProduct, IStocks} from "../common/types";
import {QUERY} from "../utils/sql";
import {DatabaseError} from "../utils/CustomError";
import {client} from "./client";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const _query = {Statement: QUERY.getAllData("products")};
    const data = await client.send(new ExecuteStatementCommand(_query));
    return (data.Items as unknown) as IProduct[]
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
};

export const getProductById = async (id: string): Promise<IProduct[]> => {
  try {
    const _query = {Statement: QUERY.getProductItemById(id)};
    const data = await client.send(new ExecuteStatementCommand(_query));
    return (data.Items as unknown) as IProduct[];
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
}

export const addNewProduct = async (params: TransactWriteItemsCommandInput): Promise<any> => {
  try {
    const result = await client.send(new TransactWriteItemsCommand(params));
    console.log(result);
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
}
