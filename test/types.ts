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