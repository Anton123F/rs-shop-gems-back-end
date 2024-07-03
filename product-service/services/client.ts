import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const dynamoDBClientConfig = {
  region: process.env.AWS_REGION || "us-east-1",
};

const client = new DynamoDBClient(dynamoDBClientConfig);
export const docClient = DynamoDBDocumentClient.from(client);
