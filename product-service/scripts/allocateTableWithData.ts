import {mockProducts, mockStocks} from "../utils/mockData";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {CreateTableCommand, KeyType, ScalarAttributeType} from "@aws-sdk/client-dynamodb";
import {IProduct, IStocks} from "../types/types";
import {getEnvironmentTables} from "../utils/utils";

const client = new DynamoDBClient({
  region: "us-east-1"
});

const {PRODUCTS_TABLE, STOCKS_TABLE} = getEnvironmentTables();
const docClient = DynamoDBDocumentClient.from(client);

async function createAndFillTable(tableName: string, tableData: IProduct[] | IStocks[]) {
  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: KeyType.HASH },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const command = new CreateTableCommand(params);
    await client.send(command);

    for (const item of tableData) {
      const params = {
        TableName: tableName,
        Item: item,
      };

      await docClient.send(new PutCommand(params));
      console.log('Item put:', item);
    }
  } catch (error) {
    console.error(error);
  }
}

///!!!!!!! need to add delay before table creating and table fill !!!!
createAndFillTable(PRODUCTS_TABLE, mockProducts);
createAndFillTable(STOCKS_TABLE, mockStocks);