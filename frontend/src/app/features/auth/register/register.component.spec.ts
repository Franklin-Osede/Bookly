import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, AuthResponse, User } from '../../../core/models/user.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with empty values', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('phone')?.value).toBe('');
  });

  it('should validate required fields', () => {
    component.registerForm.patchValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    expect(component.registerForm.valid).toBeFalsy();
    expect(component.registerForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.registerForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.registerForm.get('password')?.hasError('required')).toBeTruthy();
    expect(component.registerForm.get('confirmPassword')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    component.registerForm.patchValue({
      email: 'invalid-email',
      password: 'password123'
    });

    expect(component.registerForm.get('email')?.hasError('email')).toBeTruthy();
  });

  it('should validate password match', () => {
    component.registerForm.patchValue({
      password: 'password123',
      confirmPassword: 'different123'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should submit register form with valid data', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'CUSTOMER',
      phone: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: AuthResponse = {
      accessToken: 'mock-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: mockUser
    };

    authService.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      phone: '+1234567890'
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+1234567890'
    });
  });

  it('should handle register error', () => {
    authService.register.and.returnValue(throwError(() => ({ status: 409 })));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('El email ya está registrado');
  });

  it('should navigate to dashboard on successful registration', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: AuthResponse = {
      accessToken: 'mock-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: mockUser
    };

    authService.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to login page', () => {
    component.goToLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should show loading state during registration', () => {
    authService.register.and.returnValue(of({} as AuthResponse));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(component.isLoading).toBeTruthy();
  });
});
