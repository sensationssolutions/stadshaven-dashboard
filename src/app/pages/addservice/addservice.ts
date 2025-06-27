import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-addservice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addservice.html',
  styleUrl: './addservice.css',
})
export class Addservice {
  heading = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  servicePoints: {
    title: string;
    description: string;
    image?: File;
    preview?: string;
  }[] = [];

  loading = false;
  showSuccess = false;

  constructor(private http: HttpClient, private router: Router) {}


  addPoint(): void {
    this.servicePoints.push({ title: '', description: '' });
  }

  removePoint(index: number): void {
    this.servicePoints.splice(index, 1);
  }

  onPointImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.servicePoints[index].preview = reader.result as string;
        this.servicePoints[index].image = file;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

submitService(): void {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    alert('User not authenticated!');
    return;
  }

  const formData = new FormData();
  formData.append('title', this.heading);

  // Add JSON part (titles & descriptions only)
  const pointsMeta = this.servicePoints.map(p => ({
    title: p.title,
    description: p.description
  }));
  formData.append('points', JSON.stringify(pointsMeta));

  // Attach images
  this.servicePoints.forEach((point, i) => {
    if (point.image) {
      formData.append(`images[${i}]`, point.image);
    }
  });

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.loading = true;

  this.http.post(`${environment.apiUrl}/services`, formData, { headers }).subscribe({
    next: () => {
      this.loading = false;
      this.showSuccess = true;

      this.heading = '';
      this.servicePoints = [];
      setTimeout(() => {
        this.showSuccess = false;
        this.router.navigate(['/services']);
      }, 1500);
    },
    error: (err) => {
      this.loading = false;
      console.error('Error submitting service:', err);
      alert('Something went wrong ❌');
    }
  });
}




}
