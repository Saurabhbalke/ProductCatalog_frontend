import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Output() productAdded = new EventEmitter<void>();
  @ViewChild('productForm') productForm!: NgForm;

  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    imageUrl: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting: boolean = false;

  constructor(private productService: ProductService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Create a FileReader to preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
    }
  }

  onSubmit() {
    if (this.isSubmitting || !this.productForm.valid) return;
    
    this.isSubmitting = true;
    
    if (!this.newProduct.name || !this.newProduct.description || this.newProduct.price <= 0) {
      alert('Please fill in all fields correctly.');
      this.isSubmitting = false;
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('price', this.newProduct.price.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.addProduct(formData).subscribe({
      next: (response) => {
        alert('Product added successfully!');
        this.productAdded.emit();
        this.resetForm();
        this.productService.refreshProducts();
      },
      error: (error) => {
        alert('Error adding product: ' + error.message);
        console.error('Error:', error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    if (this.productForm) {
      this.productForm.resetForm();
    }
    this.newProduct = { name: '', description: '', price: 0, imageUrl: '' };
    this.selectedFile = null;
    this.imagePreview = null;
    this.isSubmitting = false;
  }
}
