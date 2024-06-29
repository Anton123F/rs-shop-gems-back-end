import {S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import csv from 'csv-parser';

const s3Client = new S3Client({region: process.env.REGION});

export const handler = async (event: any) => {
  console.log('S3 event:', JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  console.log(`Bucket: ${bucket}`);
  console.log(`Key: ${key}`);

  const getObjectParams = new GetObjectCommand({Bucket: bucket, Key: key});
  const bucketFile = await s3Client.send(getObjectParams);

  await new Promise((resolve, reject) => {
    // @ts-ignore
    bucketFile.Body.pipe(csv())
      .on('data', (row: any) => {
        console.log(row);
      })
      .on('end', function () {
        console.log('CSV file successfully processed');
        resolve('');
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

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: 'File processed',
  };
};