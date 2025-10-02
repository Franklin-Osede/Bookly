import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  isEdit = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reservationForm = this.fb.group({
      businessId: ['', Validators.required],
      date: ['', Validators.required],
      time: [''],
      guests: [1, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadReservation(id);
    }
  }

  private loadReservation(id: string): void {
    // TODO: Implementar carga de reserva existente
    console.log('Cargar reserva:', id);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.reservationForm.value;
      
      // TODO: Implementar creación/actualización de reserva
      console.log('Guardar reserva:', formData);
      
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/reservations']);
      }, 1000);
    }
  }

  cancel(): void {
    this.router.navigate(['/reservations']);
  }
}
