export interface ProductPrice {
  currency: {
    label: string;
    symbol: string;
  };
  amount: number;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  prices: ProductPrice[];
  gallery: string;
}
