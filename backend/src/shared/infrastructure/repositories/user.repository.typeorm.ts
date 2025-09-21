import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../application/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email';
import { PhoneNumber } from '../../domain/value-objects/phone-number';
import { UserEntity } from '../database/entities/user.entity';

@Injectable()
export class UserRepositoryTypeORM implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.name = user.name;
    userEntity.email = user.email.value;
    userEntity.password = user.password;
    userEntity.role = user.role;
    userEntity.phone = user.phone?.value;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;

    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.userRepository.findOne({ 
      where: { email: email.value.toLowerCase() } 
    });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { phone } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByRole(role: string): Promise<User[]> {
    const entities = await this.userRepository.find({ where: { role } });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async update(id: string, data: any): Promise<User> {
    await this.userRepository.update(id, data);
    const updatedEntity = await this.userRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('User not found');
    }
    return this.mapEntityToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find();
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } });
    return count > 0;
  }

  private mapEntityToDomain(entity: UserEntity): User {
    // Crear el usuario usando el método create del dominio
    const user = User.create({
      name: entity.name,
      email: new Email(entity.email),
      password: entity.password,
      role: entity.role as any,
      phone: entity.phone ? new PhoneNumber(entity.phone) : undefined,
    });
    
    // Asignar los campos que no están en create
    (user as any).id = entity.id;
    (user as any).createdAt = entity.createdAt;
    (user as any).updatedAt = entity.updatedAt;
    
    return user;
  }
}

