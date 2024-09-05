import { Price } from './price';

export class Product {
  id: number = 0;
  name: string = '';
  brand: string = '';
  prices: Price[] = [];
  gallery: string = '';
}
