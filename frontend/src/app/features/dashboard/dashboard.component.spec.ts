import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { ReservationService } from '../../core/services/reservation.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockReservationService: jasmine.SpyObj<ReservationService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const reservationServiceSpy = jasmine.createSpyObj('ReservationService', ['getReservations', 'getReservationsStats']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatDividerModule,
        MatListModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ReservationService, useValue: reservationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockReservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    // Arrange
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockReservations = [
      { id: '1', status: 'CONFIRMED', totalAmountAmount: 100 },
      { id: '2', status: 'PENDING', totalAmountAmount: 150 }
    ];
    const mockStats = {
      totalReservations: 2,
      confirmedReservations: 1,
      pendingReservations: 1,
      totalRevenue: 250,
      occupancyRate: 75
    };

    mockAuthService.getCurrentUser.and.returnValue(of(mockUser));
    mockReservationService.getReservations.and.returnValue(of(mockReservations));
    mockReservationService.getReservationsStats.and.returnValue(of(mockStats));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockReservationService.getReservations).toHaveBeenCalled();
    expect(mockReservationService.getReservationsStats).toHaveBeenCalled();
  });

  it('should display metrics correctly', () => {
    // Arrange
    component.metrics = {
      totalReservations: 10,
      confirmedReservations: 8,
      pendingReservations: 2,
      totalRevenue: 5000,
      occupancyRate: 85
    };
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('10');
    expect(compiled.textContent).toContain('8');
    expect(compiled.textContent).toContain('2');
    expect(compiled.textContent).toContain('5000');
    expect(compiled.textContent).toContain('85');
  });

  it('should show loading state when data is loading', () => {
    // Arrange
    component.isLoading = true;
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });

  it('should display recent reservations', () => {
    // Arrange
    component.recentReservations = [
      { id: '1', customerName: 'John Doe', status: 'CONFIRMED', totalAmountAmount: 100 },
      { id: '2', customerName: 'Jane Smith', status: 'PENDING', totalAmountAmount: 150 }
    ];
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('Jane Smith');
    expect(compiled.textContent).toContain('CONFIRMED');
    expect(compiled.textContent).toContain('PENDING');
  });

  it('should handle empty data gracefully', () => {
    // Arrange
    component.metrics = {
      totalReservations: 0,
      confirmedReservations: 0,
      pendingReservations: 0,
      totalRevenue: 0,
      occupancyRate: 0
    };
    component.recentReservations = [];
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('0');
    expect(compiled.querySelector('.no-data')).toBeTruthy();
  });
});
