export const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
};

export const REQUEST_METHODS = {
  GET: {"Access-Control-Allow-Methods": "GET"},
  POST: {"Access-Control-Allow-Methods": "POST"},
  PUT: {"Access-Control-Allow-Methods": "PUT"},
}

export const ERROR_MESSAGE = {
  PROJECT_NOT_FOUND: {message: "Product not found!"},
  DESCRIPTION_VALIDATION_ERROR: 'Description must not be null or an empty string',
  ID_VALIDATION_ERROR: 'ID already exists',
  COUNT_VALIDATION_ERROR: 'Count must be > 0',
  PRODUCT_ID_VALIDATION_ERROR: 'Product must not be null or an empty string',
  STOCK_ID_VALIDATION_ERROR: 'stock.product_id and product.id must be the same'
}

export const RESPONSE_MESSAGE = {
  PRODUCT_NOT_FOUND: (id: string) => ({message: `there is no a product with such id=${id}`})
}

export const MESSAGES = {
  SUCCESS_ADDED_PRODUCT: 'Product was successfully added',
}