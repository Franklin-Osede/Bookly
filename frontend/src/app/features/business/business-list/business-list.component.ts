import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class BusinessListComponent implements OnInit {
  businesses: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  private loadBusinesses(): void {
    // TODO: Implementar carga real de negocios
    this.businesses = [
      {
        id: '1',
        name: 'Hotel Plaza',
        type: 'HOTEL',
        address: 'Calle Principal 123',
        status: 'ACTIVE'
      },
      {
        id: '2',
        name: 'Restaurante El Buen Sabor',
        type: 'RESTAURANT',
        address: 'Avenida Central 456',
        status: 'ACTIVE'
      }
    ];
  }

  createBusiness(): void {
    this.router.navigate(['/business/new']);
  }

  editBusiness(id: string): void {
    this.router.navigate(['/business/edit', id]);
  }

  getBusinessTypeIcon(type: string): string {
    return type === 'HOTEL' ? 'hotel' : 'restaurant';
  }
}
