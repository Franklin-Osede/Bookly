import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ]
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading = false;

  displayedColumns: string[] = ['id', 'business', 'date', 'status', 'actions'];

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.isLoading = true;
    // TODO: Implementar carga real de reservas
    this.reservations = [
      {
        id: '1',
        businessId: '1',
        userId: '1',
        date: new Date('2024-01-15'),
        status: 'CONFIRMED',
        type: 'HOTEL',
        details: { roomNumber: '101' },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.isLoading = false;
  }

  createReservation(): void {
    this.router.navigate(['/reservations/new']);
  }

  editReservation(id: string): void {
    this.router.navigate(['/reservations/edit', id]);
  }

  cancelReservation(id: string): void {
    // TODO: Implementar cancelación
    console.log('Cancelar reserva:', id);
  }
}
