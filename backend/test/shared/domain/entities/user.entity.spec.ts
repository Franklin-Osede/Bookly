import { Email } from '../../../../src/shared/domain/value-objects/email';
import { User } from '../../../../src/shared/domain/entities/user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user with required fields', () => {
      // Arrange
      const userData = {
        email: new Email('test@bookly.com'), name: 'Test User',
        password: 'password123',
        role: 'CUSTOMER' as const,
      };

      // Act
      const user = User.create(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.email.value).toBe('test@bookly.com');
      expect(user.role).toBe('CUSTOMER');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a business owner user', () => {
      // Arrange
      const userData = {
        email: new Email('owner@hotel.com'), name: 'Test User',
        password: 'password123',
        role: 'BUSINESS_OWNER' as const,
      };

      // Act
      const user = User.create(userData);

      // Assert
      expect(user.role).toBe('BUSINESS_OWNER');
    });

    it('should create an admin user', () => {
      // Arrange
      const userData = {
        email: new Email('admin@bookly.com'), name: 'Test User',
        password: 'password123',
        role: 'ADMIN' as const,
      };

      // Act
      const user = User.create(userData);

      // Assert
      expect(user.role).toBe('ADMIN');
    });
  });

  describe('validation', () => {
    it('should throw error for invalid email', () => {
      // Act & Assert
      expect(() => new Email('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error for empty password', () => {
      // Arrange
      const userData = {
        email: new Email('test@bookly.com'), name: 'Test User',
        password: '',
        role: 'CUSTOMER' as const,
      };

      // Act & Assert
      expect(() => User.create(userData)).toThrow('Password is required');
    });

    it('should throw error for invalid role', () => {
      // Arrange
      const userData = {
        email: new Email('test@bookly.com'), name: 'Test User',
        password: 'password123',
        role: 'INVALID_ROLE' as any,
      };

      // Act & Assert
      expect(() => User.create(userData)).toThrow('Invalid user role');
    });
  });

  describe('update', () => {
    it('should update user email', () => {
      // Arrange
      const user = User.create({
        email: new Email('old@bookly.com'), name: 'Test User',
        password: 'password123',
        role: 'CUSTOMER' as const,
      });

      // Act
      user.updateEmail(new Email('new@bookly.com'));

      // Assert
      expect(user.email.value).toBe('new@bookly.com');
      expect(user.updatedAt).toBeDefined();
    });

    it('should update user password', () => {
      // Arrange
      const user = User.create({
        email: new Email('test@bookly.com'), name: 'Test User',
        password: 'oldpassword',
        role: 'CUSTOMER' as const,
      });

      // Act
      user.updatePassword('newpassword');

      // Assert
      expect(user.password).toBe('newpassword');
      expect(user.updatedAt).toBeDefined();
    });
  });
});
