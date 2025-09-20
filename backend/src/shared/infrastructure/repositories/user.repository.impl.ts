import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../application/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find(user => user.email.equals(email)) || null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.users.find(user => user.phone?.value === phone) || null;
  }

  async findByRole(role: string): Promise<User[]> {
    return this.users.filter(user => user.role === role);
  }

  async update(id: string, data: any): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = this.users[userIndex];
    user.updateInfo(data);
    this.users[userIndex] = user;
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async exists(id: string): Promise<boolean> {
    return this.users.some(user => user.id === id);
  }
}
