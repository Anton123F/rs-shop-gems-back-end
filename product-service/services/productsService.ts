import {IProduct, IStocks} from "../types/types";
import {DatabaseError} from "../utils/customError";
import {getEnvironmentTables} from "../utils/utils";
import {ScanCommand, GetCommand, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";
import {docClient} from "./client";

const {PRODUCTS_TABLE} = getEnvironmentTables();

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const defaultProps = {
      TableName: PRODUCTS_TABLE,
      Limit: 30,
    }
    const scanCommand = new ScanCommand(defaultProps);
    const data = await docClient.send(scanCommand);

    return (data.Items as unknown) as IProduct[]
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
};

export const getProductById = async (id: string): Promise<IProduct> => {
  try {
    const defaultProps = {
      TableName: PRODUCTS_TABLE,
      Key: {id},
    }
    const scanCommand = new GetCommand (defaultProps);
    const data = await docClient.send(scanCommand);

    return (data.Item as unknown) as IProduct;
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
}

export const addNewProduct = async (params: {
  TransactItems: ({ Put: { TableName: string; Item: IProduct } } | { Put: { TableName: string; Item: IStocks } })[]
}): Promise<any> => {
  try {
    const result = await docClient.send(new TransactWriteCommand(params));
    console.log(result);
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
}
