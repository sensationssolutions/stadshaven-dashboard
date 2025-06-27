import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-addtestimonial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addtestimonial.html',
  styleUrls: ['./addtestimonial.css']
})


export class Addtestimonial {

  constructor(private http: HttpClient, private router: Router) {}

  environment = environment;

  formData = {
    name: '',
    designation: '',
    message: ''
  };

  loading = false;
  showSuccess = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.resetFileInput(); 
  }

  resetFileInput() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submitTestimonial() {
    this.loading = true;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const data = new FormData();
    data.append('name', this.formData.name);
    data.append('designation', this.formData.designation);
    data.append('message', this.formData.message);
    if (this.selectedImage) {
      data.append('image', this.selectedImage);
    }

    this.http.post(`${environment.apiUrl}/testimonials`, data, { headers }).subscribe({
      next: (res) => {
        this.loading = false;
        this.showSuccess = true;
        this.formData = { name: '', designation: '', message: '' };
        this.selectedImage = null;
        this.imagePreview = null;
        this.resetFileInput(); 

        setTimeout(() => {
          this.showSuccess = false;
          this.router.navigate(['/testimonials']); 
        }, 1500); 

      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error!', 'Failed to add testimonial.', 'error');
        console.error(err);
      }
    });
  }
}

