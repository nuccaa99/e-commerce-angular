import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

export interface Currency {
  label: string;
  symbol: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currenciesSubject = new BehaviorSubject<Currency[]>([]);
  currencies$ = this.currenciesSubject.asObservable();

  private selectedCurrencySubject = new BehaviorSubject<Currency | null>(null);
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  private localStorageKey = 'selectedCurrency';

  constructor(private apollo: Apollo) {
    const savedCurrency = localStorage.getItem(this.localStorageKey);
    if (savedCurrency) {
      this.selectedCurrencySubject.next(JSON.parse(savedCurrency));
    }
  }

  fetchCurrencies(): Observable<Currency[]> {
    const GET_CURRENCIES = gql`
      query GetCurrencies {
        currencies {
          label
          symbol
        }
      }
    `;
    return this.apollo
      .query<{ currencies: Currency[] }>({ query: GET_CURRENCIES })
      .pipe(
        tap((response) => {
          const currencies = response.data.currencies;
          this.currenciesSubject.next(currencies);
          if (
            !this.selectedCurrencySubject.getValue() &&
            currencies.length > 0
          ) {
            this.setSelectedCurrency(currencies[0]);
          }
        }),
        map((response) => response.data.currencies),
        shareReplay(1),
        catchError((error) => {
          console.error('Error fetching currencies:', error);
          return of([]);
        })
      );
  }

  setSelectedCurrency(currency: Currency): void {
    this.saveCurrencyToLocalStorage(currency);
    this.updateSelectedCurrencySubject(currency);
  }

  private saveCurrencyToLocalStorage(currency: Currency): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(currency));
  }

  private updateSelectedCurrencySubject(currency: Currency): void {
    this.selectedCurrencySubject.next(currency);
  }

  getSelectedCurrency(): Currency | null {
    return this.selectedCurrencySubject.getValue();
  }
}
