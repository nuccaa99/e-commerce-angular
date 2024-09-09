export interface ProductPrice {
  currency: {
    label: string;
    symbol: string;
  };
  amount: number;
}

export interface Product {
  displaySymbol?: string;
  displayPrice?: number;
  id: number;
  name: string;
  brand: string;
  prices: ProductPrice[];
  gallery: string;
  quantity: number;
}
