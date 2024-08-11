import {handler} from '../lambda/handlers/catalogBatchProcessHandler';
import {DynamoDBDocumentClient, TransactWriteCommand} from '@aws-sdk/lib-dynamodb';
import {createTransactItems} from '../lambda/handlers/utils';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn(),
    }),
  },
  TransactWriteCommand: jest.fn(),
}));

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(),
}));

const mockEvent = {
  Records: [
    {
      body: JSON.stringify({
        id: '1',
        title: 'Ruby Enot 123',
        price: '2',
        description: 'A precious gemstone known for its red color',
        count: '511',
      }),
    },
  ],
}

describe('Test CatalogBatchProcess Function', () => {
  it('should add new record', async () => {
    const result = createTransactItems({
      id: '111',
      description: '111',
      title: '111',
      price: 10
    }, {
      id: '11',
      product_id: '111',
      count: 10
    });

    // @ts-ignore
    DynamoDBDocumentClient.from().send.mockResolvedValue('mocked response');
    await handler(mockEvent);
    // @ts-ignore
    expect(DynamoDBDocumentClient.from().send).toHaveBeenCalledWith(new TransactWriteCommand(result));
  });

  it('should thrown an error if something wen wrong during insert transaction', async () => {
    // @ts-ignore
    DynamoDBDocumentClient.from().send.mockImplementation(() => {
      throw new Error('Transaction error');
    });
    try {
      await handler(mockEvent);
    }catch (error: any) {
      expect(error.message).toEqual(new Error('Transaction error'));
    }
  });
});