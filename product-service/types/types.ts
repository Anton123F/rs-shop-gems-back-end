export interface IProduct {
  id: string,
  title: string,
  price: number,
  description: string,
  imageURL: string,
}

export interface IStocks {
  product_id: string,
  count: number,
}

export interface IFullProduct {
  id: string,
  title: string,
  price: number,
  description: string,
  count: number
}

export interface IDynamoDBResult {
  errorMessage: null | string,
  data?: IProduct[]
}

interface Headers {
  "Content-Type": string;
  "Access-Control-Allow-Headers": string;
  "Access-Control-Allow-Origin": string;
  "Access-Control-Allow-Methods": string;
}

export interface ResponseI {
  statusCode: number;
  headers: Headers;
  body: string;
}