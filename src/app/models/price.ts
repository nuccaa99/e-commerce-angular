export class Price {
  currency: {
    symbol: string;
  };
  amount: number;

  constructor(currencySymbol: string, amount: number) {
    this.currency = { symbol: currencySymbol };
    this.amount = amount;
  }
}
