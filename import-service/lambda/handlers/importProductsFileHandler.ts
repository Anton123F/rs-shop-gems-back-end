import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({region: process.env.REGION});

const HEADERS: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

export const handler = async (event: any) => {
  const fileName = event.queryStringParameters?.name?.trim();

  if (!fileName || !fileName.endsWith('.csv')) {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: 'Invalid file name. File name must not be empty and must have a .csv extension',
    };
  }

  const command = new PutObjectCommand({
    Bucket: process.env.IMPORT_BUCKET_NAME,
    Key: `uploaded/${fileName}`,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 3600});

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({signedUrl}),
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);

    return {
      statusCode: 500,
      headers: HEADERS,
      body: 'Error generating signed URL',
    };
  }
};