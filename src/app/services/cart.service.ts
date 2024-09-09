import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly localStorageKey = 'cartItems';
  private cartItemsSubject = new BehaviorSubject<Product[]>(
    this.getCartFromLocalStorage()
  );
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  addToCart(product: Product): void {
    const currentItems = [...this.cartItemsSubject.value];

    const existingProduct = currentItems.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }

    this.updateCartAndStorage(currentItems);
  }

  private updateCartAndStorage(cartItems: Product[]): void {
    this.cartItemsSubject.next(cartItems);
    this.saveCartToLocalStorage(cartItems);
  }

  private getCartFromLocalStorage(): Product[] {
    try {
      const storedCart = localStorage.getItem(this.localStorageKey);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error retrieving cart from localStorage:', error);
      return [];
    }
  }

  private saveCartToLocalStorage(cartItems: Product[]): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  getCartItems(): Product[] {
    return this.cartItemsSubject.value;
  }

  clearCart(): void {
    this.updateCartAndStorage([]);
  }

  checkout(): void {
    this.clearCart();
  }
}
