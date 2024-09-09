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
    // Fetch currencies from the service
    this.currencyService.fetchCurrencies().subscribe((response) => {
      this.currencies = response.currencies;
    });

    // Subscribe to the selected currency
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  onCurrencyChange(event: any): void {
    const selectedLabel = event.target.value;
    const selectedCurrency = this.currencies.find(
      (currency) => currency.label === selectedLabel
    );
    if (selectedCurrency) {
      this.currencyService.setSelectedCurrency(selectedCurrency);
    }
  }
}
