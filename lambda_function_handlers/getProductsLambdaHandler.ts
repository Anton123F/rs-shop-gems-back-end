import {products} from "../utils/mockData";

export const handler = async (event: any) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    body: JSON.stringify(products),
  };
};