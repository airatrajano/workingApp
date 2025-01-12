import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseUrl = 'http://localhost:8080/api/';
  constructor(private http: HttpClient) { 
    
  }

  getAllProducts(): Observable<{products: IProductDetail[]}>{
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.get<{products: IProductDetail[]}>(this.baseUrl+'products', { headers } );
  }

  getProductDetail(id: number): Observable<IProductDetail>{
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.get<IProductDetail>(this.baseUrl+`product/${id}`, { headers })
  }

  getProductType(): Observable<{types: string[]}>{
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.get<{types: string[]}>(this.baseUrl+'product-types', { headers })
  }

  addProduct(product: IProductDetail):  Observable<{message: string}> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post<{message: string}>(this.baseUrl+'product', product, {headers})
  }

  deleteProduct(id: number): Observable<{message: string}>{
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.delete<{message: string}>(this.baseUrl+`product/${id}`, {headers})
  }

}

export interface IProductDetail {
  type: string,
  name: string,
  id: number | string,
  price: number | string
}
