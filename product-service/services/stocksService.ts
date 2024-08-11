import {IStocks} from "../types/types";
import {docClient} from "./client";
import {DatabaseError} from "../utils/customError";
import {GetCommand, ScanCommand} from "@aws-sdk/lib-dynamodb";
import {getEnvironmentTables} from "../utils/utils";

const {STOCKS_TABLE} = getEnvironmentTables();

export const getAllStocks = async (): Promise<IStocks[]> => {
  try {
    const defaultProps = {
      TableName: STOCKS_TABLE,
      Limit: 30,
    }
    const scanCommand = new ScanCommand(defaultProps);
    const data = await docClient.send(scanCommand);

    return (data.Items as unknown) as IStocks[]
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
};

export const getStocksById = async (id: string): Promise<IStocks> => {
  try {

    const defaultProps = {
      TableName: STOCKS_TABLE,
      Key: {
        product_id: id,
      },
    }
    const scanCommand = new GetCommand (defaultProps);
    const data = await docClient.send(scanCommand);

    return (data.Item as unknown) as IStocks;
  } catch (err: any) {
    console.error(err);
    throw new DatabaseError(err.message);
  }
}