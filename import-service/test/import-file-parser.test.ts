import { handler } from '../lambda/handlers/importFileParserHandler';
import AWS from 'aws-sdk-mock';

jest.mock('csv-parser', () => () => ({
  on: jest.fn().mockReturnThis(),
  write: jest.fn(),
}));

describe('handler', () => {
  beforeEach(() => {
    AWS.mock('S3', 'getObject', Promise.resolve({
      Body: 'name,age\nAlice,30\nBob,25',
    }));
  });

  afterEach(() => {
    AWS.restore('S3');
  });

  it('processes a CSV file', async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'my-bucket',
            },
            object: {
              key: 'uploaded/test.csv',
            },
          },
        },
      ],
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('File processed');
  });
});