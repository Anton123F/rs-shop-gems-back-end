import {IProduct, IStocks} from "../types/types";

export const mockProducts: IProduct[] = [
  {id: '101', title: 'Diamond', price: 10, description: 'Brilliant, hardest known natural material.'},
  {id: '102', title: 'Ruby', price: 20, description: 'Bright red, symbolizes love and passion.'},
  {id: '103', title: 'Emerald', price: 30, description: 'Vibrant green, represents rebirth and wealth'},
];

export const mockStocks: IStocks[] = [
  { id: '1', product_id: '101', count: 10 },
  { id: '2', product_id: '102', count: 5 },
  { id: '3', product_id: '103', count: 17 },
];