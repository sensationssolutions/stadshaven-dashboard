// editservice.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editservice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editservice.html',
  styleUrls: ['./editservice.css']
})
export class Editservice implements OnInit {
  serviceId!: number;
  heading = '';
  servicePoints: {
    title: string;
    description: string;
    image?: File;
    preview?: string;
  }[] = [];

  loading = false;
  showSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadService();
  }

  loadService(): void {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${environment.apiUrl}/services/${this.serviceId}`, { headers })
      .subscribe({
        next: (res) => {
          this.heading = res.title || '';
          const points = Array.isArray(res.points) ? res.points : JSON.parse(res.points || '[]');
          this.servicePoints = points.map((p: any) => ({
            title: p.title,
            description: p.description,
            preview: p.image_url ? environment.assetsUrl + p.image_url : null
          }));
        },
        error: (err) => {
          console.error('Error fetching service:', err);
        }
      });
  }

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

  updateService(): void {
    this.loading = true;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', this.heading);

    const pointsMeta = this.servicePoints.map(p => ({
      title: p.title,
      description: p.description
    }));
    formData.append('points', JSON.stringify(pointsMeta));

    this.servicePoints.forEach((point, i) => {
      if (point.image) {
        formData.append(`images[${i}]`, point.image);
      }
    });

    this.http.post(`${environment.apiUrl}/services/${this.serviceId}`, formData, { headers })
      .subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
            this.router.navigate(['/services']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error updating service:', err);
        }
      });
  }

  
}
