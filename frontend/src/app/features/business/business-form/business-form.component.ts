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

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class BusinessFormComponent implements OnInit {
  businessForm: FormGroup;
  isEdit = false;
  isLoading = false;
  errorMessage = '';

  businessTypes = [
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESTAURANT', label: 'Restaurante' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      address: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.email]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadBusiness(id);
    }
  }

  private loadBusiness(id: string): void {
    // TODO: Implementar carga de negocio existente
    console.log('Cargar negocio:', id);
  }

  onSubmit(): void {
    if (this.businessForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.businessForm.value;
      
      // TODO: Implementar creación/actualización de negocio
      console.log('Guardar negocio:', formData);
      
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/business']);
      }, 1000);
    }
  }

  cancel(): void {
    this.router.navigate(['/business']);
  }
}
