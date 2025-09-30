import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user successfully', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse: AuthResponse = {
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'CUSTOMER',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockResponse.user);
      });

      const req = httpMock.expectOne('/api/v1/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginRequest).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/v1/auth/login');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register user successfully', () => {
      const registerRequest: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890'
      };

      const mockResponse: AuthResponse = {
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'CUSTOMER',
          phone: '+1234567890',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      service.register(registerRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockResponse.user);
      });

      const req = httpMock.expectOne('/api/v1/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should logout user and clear session', () => {
      // First login
      const mockResponse: AuthResponse = {
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'CUSTOMER',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      service.login({ email: 'test@example.com', password: 'password123' }).subscribe();
      const loginReq = httpMock.expectOne('/api/v1/auth/login');
      loginReq.flush(mockResponse);

      expect(service.isAuthenticated()).toBe(true);

      // Then logout
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create a new service instance after setting localStorage
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      const newService = TestBed.inject(AuthService);
      expect(newService.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when not authenticated', () => {
      localStorage.removeItem('currentUser');
      const newService = TestBed.inject(AuthService);
      expect(newService.getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      const newService = TestBed.inject(AuthService);
      expect(newService.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      localStorage.removeItem('currentUser');
      const newService = TestBed.inject(AuthService);
      expect(newService.isAuthenticated()).toBe(false);
    });
  });
});
