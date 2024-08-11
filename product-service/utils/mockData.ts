import {IProduct, IStocks} from "../types/types";

export const mockProducts: IProduct[] = [
  {id: '101', title: 'Diamond', price: 10, imageURL: 'example', description: 'Brilliant, hardest known natural material.'},
  {id: '102', title: 'Ruby', price: 20, imageURL: 'example', description: 'Bright red, symbolizes love and passion.'},
  {id: '103', title: 'Emerald', price: 30, imageURL: 'example', description: 'Vibrant green, represents rebirth and wealth'},
];

export const mockStocks: IStocks[] = [
  { product_id: '101', count: 10 },
  { product_id: '102', count: 5 },
  { product_id: '103', count: 17 },
];