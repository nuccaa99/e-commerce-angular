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
    // Log when component initializes
    console.log('CartViewComponent initialized');

    // Subscribe to cart items
    this.cartService.cartItems$.subscribe((data) => {
      console.log('Cart items received:', data); // Debug log
      this.cartItems = data;
      this.calculateTotalPrice();
    });

    // Subscribe to currency changes
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
      return total + (price ? price.amount : 0);
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.snackbar.open('Thank you for your purchase', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    this.cartService.checkout();
  }
}
