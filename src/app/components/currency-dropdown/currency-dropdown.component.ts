import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';

@Component({
  selector: 'app-currency-dropdown',
  templateUrl: './currency-dropdown.component.html',
  styleUrls: ['./currency-dropdown.component.css'],
})
export class CurrencyDropdownComponent implements OnInit {
  currencies: Currency[] = [];
  selectedCurrency: Currency | null = null;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.fetchCurrencies().subscribe((response) => {
      this.currencies = response.currencies;

      const savedCurrency = this.currencyService.getSelectedCurrency();
      if (savedCurrency) {
        this.selectedCurrency = savedCurrency;
      } else if (this.currencies.length > 0) {
        this.selectedCurrency = this.currencies[0];
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
      }
    });
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  onCurrencyChange(event: any): void {
    console.log(event.value);
    const selectedLabel = event.value;
    const selectedCurrency = this.currencies.find(
      (currency) => currency.label === selectedLabel
    );
    if (selectedCurrency) {
      this.currencyService.setSelectedCurrency(selectedCurrency);
    }
  }
}
