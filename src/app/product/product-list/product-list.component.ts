import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Currency } from 'src/app/models/currency';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOrder: string = '';
  selectedCurrency: Currency | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private currencyService: CurrencyService
  ) {}

  selectedPrice: any;

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;

      this.updateProductPrices();
    });

    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
      this.updateProductPrices();
    });
  }

  updateProductPrices(): void {
    if (this.selectedCurrency) {
      this.filteredProducts.forEach((product) => {
        const price = product.prices.find(
          (p) => p.currency.symbol === this.selectedCurrency!.symbol
        );

        if (price) {
          product.displayPrice = price.amount;
          product.displaySymbol = price.currency.symbol;
        }
      });
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackbar.open('added to cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  applyFilter(event: Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLocaleLowerCase();

    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLocaleLowerCase().includes(searchTerm) ||
        product.brand.toLocaleLowerCase().includes(searchTerm)
    );
    this.sortProducts(this.sortOrder);
  }

  sortProducts(sortVlaue: string) {
    this.sortOrder = sortVlaue;
    if (this.sortOrder === 'priceLowHigh') {
      this.filteredProducts.sort(
        (a, b) => a.prices[0].amount - b.prices[0].amount
      );
    } else if (this.sortOrder === 'priceHighLow') {
      this.filteredProducts.sort(
        (a, b) => b.prices[0].amount - a.prices[0].amount
      );
    }
  }
}
