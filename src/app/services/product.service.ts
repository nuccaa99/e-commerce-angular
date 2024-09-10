import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apollo: Apollo) {}

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
