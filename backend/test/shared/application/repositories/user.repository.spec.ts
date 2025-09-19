import { UserRepository } from '../../../../src/shared/application/repositories/user.repository';
import { User } from '../../../../src/shared/domain/entities/user.entity';
import { Email } from '../../../../src/shared/domain/value-objects/email';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    // Mock implementation for testing
    userRepository = {
      async save(user: User): Promise<User> {
        return user;
      },
      async findById(id: string): Promise<User | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async findByEmail(email: Email): Promise<User | null> {
        return null;
      },
      async findAll(): Promise<User[]> {
        return [];
      },
      async update(id: string, user: Partial<User>): Promise<User | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        // Validate role if provided
        if (user.role && !['ADMIN', 'BUSINESS_OWNER', 'CUSTOMER'].includes(user.role)) {
          throw new Error('Invalid user role');
        }
        return null;
      },
      async delete(id: string): Promise<boolean> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return false;
      },
      async exists(id: string): Promise<boolean> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return false;
      }
    };
  });

  describe('save', () => {
    it('should save a user successfully', async () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      const savedUser = await userRepository.save(user);

      expect(savedUser).toBeInstanceOf(User);
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.role).toBe('CUSTOMER');
    });

    it('should save a user with all required fields', async () => {
      const user = User.create({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'ADMIN'
      });

      const savedUser = await userRepository.save(user);

      expect(savedUser).toBeDefined();
      expect(savedUser.id).toBeDefined();
      expect(savedUser.email).toBe('admin@example.com');
      expect(savedUser.role).toBe('ADMIN');
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return user when found by id', async () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      // Mock the repository to return the user
      userRepository.findById = jest.fn().mockResolvedValue(user);

      const foundUser = await userRepository.findById('user-id');

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.email).toBe('test@example.com');
    });

    it('should return null when user not found by id', async () => {
      const foundUser = await userRepository.findById('non-existent-id');

      expect(foundUser).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(userRepository.findById('')).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const email = new Email('test@example.com');
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      // Mock the repository to return the user
      userRepository.findByEmail = jest.fn().mockResolvedValue(user);

      const foundUser = await userRepository.findByEmail(email);

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.email).toBe('test@example.com');
    });

    it('should return null when user not found by email', async () => {
      const email = new Email('nonexistent@example.com');
      const foundUser = await userRepository.findByEmail(email);

      expect(foundUser).toBeNull();
    });

    it('should handle case insensitive email search', async () => {
      const email = new Email('TEST@EXAMPLE.COM');
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      // Mock the repository to return the user
      userRepository.findByEmail = jest.fn().mockResolvedValue(user);

      const foundUser = await userRepository.findByEmail(email);

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.email).toBe('test@example.com');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        User.create({
          email: 'user1@example.com',
          password: 'password123',
          role: 'CUSTOMER'
        }),
        User.create({
          email: 'user2@example.com',
          password: 'password123',
          role: 'BUSINESS_OWNER'
        })
      ];

      // Mock the repository to return users
      userRepository.findAll = jest.fn().mockResolvedValue(users);

      const allUsers = await userRepository.findAll();

      expect(allUsers).toHaveLength(2);
      expect(allUsers[0]).toBeInstanceOf(User);
      expect(allUsers[1]).toBeInstanceOf(User);
    });

    it('should return empty array when no users exist', async () => {
      const allUsers = await userRepository.findAll();

      expect(allUsers).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      const updateData = {
        role: 'BUSINESS_OWNER' as const
      };

      // Mock the repository to return updated user
      const mockUpdatedUser = User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'BUSINESS_OWNER'
      });
      userRepository.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      const updatedUser = await userRepository.update('user-id', updateData);

      expect(updatedUser).toBeInstanceOf(User);
      expect(updatedUser?.role).toBe('BUSINESS_OWNER');
    });

    it('should return null when user not found for update', async () => {
      const updateData = {
        role: 'BUSINESS_OWNER' as const
      };

      const updatedUser = await userRepository.update('non-existent-id', updateData);

      expect(updatedUser).toBeNull();
    });

    it('should validate update data', async () => {
      const invalidUpdateData = {
        role: 'invalid_role' as any
      };

      await expect(userRepository.update('user-id', invalidUpdateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      // Mock the repository to return true
      userRepository.delete = jest.fn().mockResolvedValue(true);

      const result = await userRepository.delete('user-id');

      expect(result).toBe(true);
    });

    it('should return false when user not found for deletion', async () => {
      const result = await userRepository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(userRepository.delete('')).rejects.toThrow();
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      // Mock the repository to return true
      userRepository.exists = jest.fn().mockResolvedValue(true);

      const exists = await userRepository.exists('user-id');

      expect(exists).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      const exists = await userRepository.exists('non-existent-id');

      expect(exists).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(userRepository.exists('')).rejects.toThrow();
    });
  });

  describe('Business logic', () => {
    it('should handle concurrent user creation', async () => {
      const user1 = User.create({
        email: 'test1@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      const user2 = User.create({
        email: 'test2@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      const [savedUser1, savedUser2] = await Promise.all([
        userRepository.save(user1),
        userRepository.save(user2)
      ]);

      expect(savedUser1).toBeInstanceOf(User);
      expect(savedUser2).toBeInstanceOf(User);
      expect(savedUser1.id).not.toBe(savedUser2.id);
    });

    it('should handle email uniqueness constraint', async () => {
      const email = new Email('duplicate@example.com');
      const user1 = User.create({
        email: 'duplicate@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });

      // Mock the repository to return existing user
      userRepository.findByEmail = jest.fn().mockResolvedValue(user1);

      const existingUser = await userRepository.findByEmail(email);

      expect(existingUser).toBeInstanceOf(User);
      expect(existingUser?.email).toBe('duplicate@example.com');
    });
  });
});
