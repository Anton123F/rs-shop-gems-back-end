import {DynamoDBDocumentClient, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {createTransactItems, parseMessageBody} from "./utils";
import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";

const dbConfig = {
  region: process.env.REGION
}

const ddbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient(dbConfig)
);
const snsClient = new SNSClient({ region: process.env.REGION });

export const handler = async (event: any) => {
  try {
    for (let record of event.Records) {
      let messageBody = JSON.parse(record.body);

      console.log(`inside Batch Process Handler, mesage body`);
      console.log(messageBody);

      const {product, stock} = parseMessageBody(messageBody);
      const params = createTransactItems(product, stock);

      try {
        const command = new TransactWriteCommand(params);
        const response = await ddbClient.send(command);
        console.log(`Items put in DynamoDB tables: ${JSON.stringify(response)}`);

        const snsParams = {
          Message: `Product added with price greater than or equal to 5000, Product is ${product.title}`,
          TopicArn: process.env.SNS_QUEUE_ARN,
          MessageAttributes: {
            price: {
              DataType: "Number",
              StringValue: String(product.price),
            },
          },
        };

        const snsCommand = new PublishCommand(snsParams);
        await snsClient.send(snsCommand);
      } catch (error) {
        console.error(`Error putting items in DynamoDB tables: ${error}`);
        throw error;
      }
    }

    const snsParams = {
      Message: "Product added successfully SNS Message from Lambda Function",
      TopicArn: process.env.SNS_QUEUE_ARN,
      MessageAttributes: {
        successfullyAdded: {
          DataType: "String",
          StringValue: "true",
        },
      },
    };

    const snsCommand = new PublishCommand(snsParams);
    await snsClient.send(snsCommand);

    console.log(`SNS topic notification was successfully crated`);
  } catch (error: any) {
    console.error(`Something went wrong during parsing SQS messages, ${error.message}`);
  }
}

/*
for tests only
 */
// handler({
//   Records: [
//     {
//       messageId: '1',
//       receiptHandle: 'string',
//       body: JSON.stringify({
//         id: '1',
//         title: 'Ruby Enot 123',
//         price: '2',
//         description: 'A precious gemstone known for its red color',
//         count: '511',
//       }),
//       attributes: [],
//       messageAttributes: [],
//       md5OfBody: 'string',
//       eventSource: 'aws:sqs',
//       eventSourceARN: 'string',
//       awsRegion: 'us-east-1',
//     },
//   ],
// })