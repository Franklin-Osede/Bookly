import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer'
  })
  tokenType: string;

  @ApiProperty({
    description: 'Tiempo de expiración en segundos',
    example: 3600
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Información del usuario',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'user-123' },
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', example: 'usuario@ejemplo.com' },
      role: { type: 'string', example: 'CUSTOMER' }
    }
  })
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
