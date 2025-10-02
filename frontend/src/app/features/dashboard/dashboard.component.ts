import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ReservationService } from '../../core/services/reservation.service';
import { User } from '../../core/models/user.model';
import { Reservation } from '../../core/models/reservation.model';

interface DashboardMetrics {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  totalRevenue: number;
  occupancyRate: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule
  ]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;
  
  // Métricas del dashboard
  metrics: DashboardMetrics = {
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    totalRevenue: 0,
    occupancyRate: 0
  };

  // Reservas recientes
  recentReservations: Reservation[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Cargar datos del usuario
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    // Cargar métricas
    this.reservationService.getReservationsStats().subscribe(stats => {
      this.metrics = stats;
    });

    // Cargar reservas recientes
    this.reservationService.getReservations().subscribe(reservations => {
      this.recentReservations = reservations.slice(0, 5); // Últimas 5
      this.isLoading = false;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'primary';
      case 'PENDING':
        return 'accent';
      case 'CANCELLED':
        return 'warn';
      default:
        return 'basic';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPLETED':
        return 'Completada';
      default:
        return status;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  navigateToReservations(): void {
    this.router.navigate(['/reservations']);
  }

  navigateToBusiness(): void {
    this.router.navigate(['/business']);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}