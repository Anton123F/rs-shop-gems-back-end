import {handler} from '../lambda/handlers/importFileParserHandler';
import {S3Client} from '@aws-sdk/client-s3';
import {SQSClient,} from '@aws-sdk/client-sqs';
import {Readable} from 'stream';

jest.mock('@aws-sdk/client-s3', () => {
  const mockS3Client = {send: jest.fn()};
  return {
    S3Client: jest.fn(() => mockS3Client),
    GetObjectCommand: jest.fn(),
    CopyObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn()
  };
});

jest.mock('@aws-sdk/client-sqs', () => {
  const mockSQSClient = {send: jest.fn()};
  return {
    SQSClient: jest.fn(() => mockSQSClient),
    SendMessageCommand: jest.fn(),
  };
});

describe('handler function', () => {
  it('should process S3 event', async () => {
    const mockEvent = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'mockBucket',
            },
            object: {
              key: 'mockKey',
            },
          },
        },
      ],
    };

    const csvData = 'id,title,price,description,count\n1,Ruby Enot 123,2,A precious gemstone known for its red color,511';
    const s3Client = new S3Client({region: process.env.REGION});
    const readable = Readable.from(csvData);
    //@ts-ignore
    s3Client.send.mockResolvedValueOnce({
      Body: readable,
    });

    const sqsClient = new SQSClient({region: process.env.REGION});
    //@ts-ignore
    sqsClient.send.mockResolvedValue({MessageId: 'mockMessageId'});

    await handler(mockEvent);

    expect(s3Client.send).toHaveBeenCalledTimes(3);
    expect(sqsClient.send).toHaveBeenCalledTimes(1);
  });
});