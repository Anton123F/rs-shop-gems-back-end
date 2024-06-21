import {IStocks} from "../common/types";
import {QUERY} from "../utils/sql";
import {client} from "./client";
import {ExecuteStatementCommand} from "@aws-sdk/client-dynamodb";
import {DatabaseError} from "../utils/CustomError";

export const getAllStocks = async (): Promise<IStocks[]> => {
  try {
    const _query = {Statement: QUERY.getAllData("stocks")};
    const data = await client.send(new ExecuteStatementCommand(_query));
    return (data.Items as unknown) as IStocks[]
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
};

export const getStocksById = async (id: string): Promise<IStocks[]> => {
  try {
    const _query = {Statement: QUERY.getStockItemById(id)};
    const data = await client.send(new ExecuteStatementCommand(_query));
    return (data.Items as unknown) as IStocks[];
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
}