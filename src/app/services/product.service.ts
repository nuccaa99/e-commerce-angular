import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private apollo: Apollo) {}

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.apiUrl);
  // }

  getProducts(category: string): Observable<any> {
    return this.apollo
      .query({
        query: gql`
          query GetProducts($category: String!) {
            category(input: { title: $category }) {
              name
              products {
                id
                name
                gallery
                inStock
                brand
                prices {
                  currency {
                    symbol
                  }
                  amount
                }
              }
            }
          }
        `,
        variables: {
          category,
        },
      })
      .pipe(map((result: any) => result.data.category.products));
  }
}
