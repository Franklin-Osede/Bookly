import { Email } from '../value-objects/email';
import { PhoneNumber } from '../value-objects/phone-number';

export type UserRole = 'ADMIN' | 'BUSINESS_OWNER' | 'CUSTOMER';

export interface CreateUserData {
  name: string;
  email: Email;
  password: string;
  role: UserRole;
  phone?: PhoneNumber;
}

export class User {
  public readonly id: string;
  public name: string;
  public email: Email;
  public password: string;
  public role: UserRole;
  public phone?: PhoneNumber;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(data: CreateUserData & { id: string; createdAt: Date; updatedAt: Date }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.phone = data.phone;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateUserData): User {
    // Validaciones
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
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
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateEmail(newEmail: Email): void {
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

  updateInfo(data: Partial<{ name: string; email: Email; phone: PhoneNumber }>): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim() === '') {
        throw new Error('Name is required');
      }
      this.name = data.name;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    this.updatedAt = new Date();
  }

  private static isValidEmail(email: Email): boolean {
    return email !== null && email !== undefined;
  }

  private static isValidRole(role: string): role is UserRole {
    return ['ADMIN', 'BUSINESS_OWNER', 'CUSTOMER'].includes(role);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

