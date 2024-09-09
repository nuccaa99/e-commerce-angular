import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface Currency {
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

  private apiUrl = environment.apiUrl + '/currencies';

  private localStorageKey = 'selectedCurrency';

  constructor(private http: HttpClient) {
    const savedCurrency = localStorage.getItem(this.localStorageKey);
    if (savedCurrency) {
      this.selectedCurrencySubject.next(JSON.parse(savedCurrency));
    }
  }

  fetchCurrencies(): Observable<{ currencies: Currency[] }> {
    return this.http.get<{ currencies: Currency[] }>(this.apiUrl).pipe(
      tap((response) => {
        this.currenciesSubject.next(response.currencies);
        if (!this.selectedCurrencySubject.getValue() && response.currencies.length > 0) {
          this.setSelectedCurrency(response.currencies[0]);
        }
      })
    );
  }

  setSelectedCurrency(currency: Currency): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(currency));
    this.selectedCurrencySubject.next(currency);
  }

  getSelectedCurrency(): Currency | null {
    return this.selectedCurrencySubject.getValue();
  }
}
