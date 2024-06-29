import { handler } from '../lambda/handlers/importProductsFileHandler';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/s3-request-presigner');

describe('handler', () => {
  beforeEach(() => {
    process.env.REGION = 'us-west-1';
    process.env.IMPORT_BUCKET_NAME = 's3-mock-bucket';
  });

  it('returns 400 if file name is empty', async () => {
    const event = { queryStringParameters: { name: '' } };
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
  });

  it('returns 400 if file name does not have .csv extension', async () => {
    const event = { queryStringParameters: { name: 'file.txt' } };
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
  });

  it('returns 200 and signed URL if file name is valid', async () => {
    (getSignedUrl as jest.Mock).mockResolvedValue('https://signed-url');
    const event = { queryStringParameters: { name: 'file.csv' } };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ signedUrl: 'https://signed-url' }));
  });
});