import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://productcatalog-backend-eebkc5f3hsbgh9ee.eastus-01.azurewebsites.net/products'; // Backend API
  private refreshRequired = new Subject<void>();

  constructor(private http: HttpClient) {}

  get refreshRequired$() {
    return this.refreshRequired.asObservable();
  }

  refreshProducts() {
    this.refreshRequired.next();
  }

  // Upload product with image
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Fetch all products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
