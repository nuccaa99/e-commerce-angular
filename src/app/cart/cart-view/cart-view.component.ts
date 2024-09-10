import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from 'src/app/models/product';
import { CurrencyService } from '../../services/currency.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css'],
})
export class CartViewComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice: number = 0;
  selectedCurrencySymbol: string = '';

  constructor(
    private cartService: CartService,
    private currencyService: CurrencyService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((data) => {
      this.cartItems = data;
      this.calculateTotalPrice();
    });

    this.currencyService.selectedCurrency$.subscribe((currency) => {
      if (currency) {
        this.selectedCurrencySymbol = currency.symbol;
        this.calculateTotalPrice();
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      const price = item.prices.find(
        (p) => p.currency.symbol === this.selectedCurrencySymbol
      );
      const q = item.quantity;
      return total + (price ? price.amount * q : 0);
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.snackbar.open('Thank you for your purchase', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    this.cartService.checkout();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '../assets/no-img.jpg';
  }
}
