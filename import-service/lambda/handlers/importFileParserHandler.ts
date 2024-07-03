import {S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import {SQSClient, SendMessageCommand} from "@aws-sdk/client-sqs";
import csv from 'csv-parser';

const s3Client = new S3Client({region: process.env.REGION});
const sqsClient = new SQSClient({ region: process.env.REGION });

export const handler = async (event: any) => {
  console.log('S3 event:', JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  console.log(`Bucket: ${bucket}`);
  console.log(`Key: ${key}`);

  try {
    const getObjectParams = new GetObjectCommand({Bucket: bucket, Key: key});
    const bucketFile = await s3Client.send(getObjectParams);

    await new Promise((resolve, reject) => {
      // @ts-ignore
      bucketFile.Body.pipe(csv())
        .on('data', async (row: any) => {
          const params = {
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(row),
          };

          try {
            const command = new SendMessageCommand(params);
            const response = await sqsClient.send(command);
            console.log(`Message sent to SQS: ${response.MessageId}`);
          } catch (error) {
            console.error(`Error sending SQS message: ${error}`);
            reject(error);
          }
        })
        .on('end', function () {
          console.log('CSV file successfully processed');
          resolve('CSV file successfully processed');
        });
    });

    const newKey = key.replace('uploaded', 'parsed');

    const copyObjectParams = {
      Bucket: bucket,
      CopySource: `${bucket}/${key}`,
      Key: newKey,
    };

    await s3Client.send(new CopyObjectCommand(copyObjectParams));

    const deleteObjectParams = {
      Bucket: bucket,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteObjectParams));

    console.log(`.csv file was successfully parsed`)
  } catch (e) {
    console.log(e)
    console.error('Something went wrong during .csv file parse!')
  }
};