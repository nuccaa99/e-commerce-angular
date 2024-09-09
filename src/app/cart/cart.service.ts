import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Product[]>(
    this.getCartFromLocalStorage()
  );
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  // Add product to cart and update localStorage
  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = [...currentItems, product];
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToLocalStorage(updatedItems); // Save to localStorage
  }

  // Retrieve cart items from localStorage
  private getCartFromLocalStorage(): Product[] {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Save cart items to localStorage
  private saveCartToLocalStorage(cartItems: Product[]): void {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  // Get current cart items
  getCartItems(): Product[] {
    return this.cartItemsSubject.value;
  }

  // Clear cart and localStorage
  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cartItems'); // Clear localStorage
  }

  // Checkout method (just clearing the cart for now)
  checkout(): void {
    this.clearCart();
  }
}
