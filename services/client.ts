import {DynamoDBClient, TransactWriteItemsCommand} from "@aws-sdk/client-dynamodb";

const dynamoDBClientConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  // endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
};

export const client = new DynamoDBClient(dynamoDBClientConfig);