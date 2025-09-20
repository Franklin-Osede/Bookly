import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from '../application/dto/auth/login.dto';
import { RegisterDto } from '../application/dto/auth/register.dto';
import { AuthResponseDto } from '../application/dto/auth/auth-response.dto';
import { LocalAuthGuard } from '../infrastructure/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../infrastructure/auth/decorators/current-user.decorator';
import { User } from '../domain/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en Bookly'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado'
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT'
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas'
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Obtiene la información del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user-123' },
        name: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        phone: { type: 'string', example: '+1234567890' },
        role: { type: 'string', example: 'CUSTOMER' },
        createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado'
  })
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return this.authService.getProfile(user.id);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Renovar token',
    description: 'Genera un nuevo token JWT para el usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado'
  })
  async refresh(@CurrentUser() user: User): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email.value,
      role: user.role,
    };

    const accessToken = this.authService['jwtService'].sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
      },
    };
  }
}
