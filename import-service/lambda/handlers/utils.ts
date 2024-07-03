export const generateRandomId = (length: number = 10) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

interface IProducts {
  title: string,
  price: number,
  description: string
}

interface IProductsTableRecord extends IProducts {
  id: string
}

interface IStocks {
  product_id: string,
  count: number
}

interface IStocksTableRecord extends IStocks {
  product_id: string,
  id: string
}

type IMessageBody = IProducts & Omit<IStocks, 'product_id'>;

interface IParsedMessageBody {
  product: IProductsTableRecord,
  stock: IStocksTableRecord
}

export const parseMessageBody = (messageBody: IMessageBody): IParsedMessageBody => {
  const id = generateRandomId();
  const {price, description, count, title} = messageBody;
  return {
    product: {
      id,
      price,
      title,
      description
    },
    stock: {
      id: generateRandomId(),
      count,
      product_id: id
    }
  }
}
export const createTransactItems = (product: IProductsTableRecord, stock: IStocksTableRecord) => {
  return {
    TransactItems: [
      {
        Put: {
          TableName: 'products', // use process.env after development !!!!!!!!!
          Item: product
        },
      },
      {
        Put: {
          TableName: 'stocks',
          Item: stock,
        },
      },
    ],
  }
}