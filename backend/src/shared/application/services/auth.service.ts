import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email';
import { PhoneNumber } from '../../domain/value-objects/phone-number';
import { REPOSITORY_TOKENS } from '../tokens/repository.tokens';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { AuthResponseDto } from '../dto/auth/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(new Email(email));
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email.value,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hora
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(new Email(registerDto.email));
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario
    const user = User.create({
      name: registerDto.name,
      email: new Email(registerDto.email),
      password: hashedPassword,
      phone: registerDto.phone ? new PhoneNumber(registerDto.phone) : undefined,
      role: 'CUSTOMER',
    });

    // Guardar el usuario
    const savedUser = await this.userRepository.save(user);

    // Generar token
    const payload = {
      sub: savedUser.id,
      email: savedUser.email.value,
      role: savedUser.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email.value,
        role: savedUser.role,
      },
    };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }
}
