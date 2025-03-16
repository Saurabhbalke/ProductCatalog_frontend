import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  isLoading: boolean = true;
  private refreshSubscription!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
    
    // Subscribe to refresh events
    this.refreshSubscription = this.productService.refreshRequired$
      .subscribe(() => {
        this.fetchProducts();
      });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply search text filter
    if (this.searchText?.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase().trim())
      );
    }

    // Apply price range filter
    if (this.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= this.minPrice!);
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= this.maxPrice!);
    }

    this.filteredProducts = filtered;
  }

  resetFilters() {
    this.searchText = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.filteredProducts = [...this.products];
  }

  truncateDescription(description: string, wordLimit: number = 35): string {
    if (!description) return '';
    
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  }
}
