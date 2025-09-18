import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user with required fields', () => {
      // Arrange
      const userData = {
        email: 'test@bookly.com',
        password: 'password123',
        role: 'CUSTOMER' as const,
      };

      // Act
      const user = User.create(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe('test@bookly.com');
      expect(user.role).toBe('CUSTOMER');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a business owner user', () => {
      // Arrange
      const userData = {
        email: 'owner@hotel.com',
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
        email: 'admin@bookly.com',
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
      // Arrange
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        role: 'CUSTOMER' as const,
      };

      // Act & Assert
      expect(() => User.create(userData)).toThrow('Invalid email format');
    });

    it('should throw error for empty password', () => {
      // Arrange
      const userData = {
        email: 'test@bookly.com',
        password: '',
        role: 'CUSTOMER' as const,
      };

      // Act & Assert
      expect(() => User.create(userData)).toThrow('Password is required');
    });

    it('should throw error for invalid role', () => {
      // Arrange
      const userData = {
        email: 'test@bookly.com',
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
        email: 'old@bookly.com',
        password: 'password123',
        role: 'CUSTOMER' as const,
      });

      // Act
      user.updateEmail('new@bookly.com');

      // Assert
      expect(user.email).toBe('new@bookly.com');
      expect(user.updatedAt).toBeDefined();
    });

    it('should update user password', () => {
      // Arrange
      const user = User.create({
        email: 'test@bookly.com',
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
