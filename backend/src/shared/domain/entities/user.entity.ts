export type UserRole = 'ADMIN' | 'BUSINESS_OWNER' | 'CUSTOMER';

export interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
}

export class User {
  public readonly id: string;
  public email: string;
  public password: string;
  public role: UserRole;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(data: CreateUserData & { id: string; createdAt: Date; updatedAt: Date }) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateUserData): User {
    // Validaciones
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (!data.password || data.password.trim() === '') {
      throw new Error('Password is required');
    }

    if (!this.isValidRole(data.role)) {
      throw new Error('Invalid user role');
    }

    const now = new Date();
    return new User({
      id: this.generateId(),
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateEmail(newEmail: string): void {
    if (!User.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
    this.updatedAt = new Date();
  }

  updatePassword(newPassword: string): void {
    if (!newPassword || newPassword.trim() === '') {
      throw new Error('Password is required');
    }
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidRole(role: string): role is UserRole {
    return ['ADMIN', 'BUSINESS_OWNER', 'CUSTOMER'].includes(role);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

