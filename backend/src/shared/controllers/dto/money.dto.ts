import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, IsOptional } from 'class-validator';

export class MoneyDto {
  @ApiProperty({
    description: 'Cantidad del precio',
    example: 150.00,
    minimum: 0
  })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Moneda del precio',
    example: 'USD',
    enum: ['USD', 'EUR', 'MXN']
  })
  @IsString()
  currency: string;
}

export class MoneyResponseDto {
  @ApiProperty({
    description: 'Cantidad del precio',
    example: 150.00
  })
  amount: number;

  @ApiProperty({
    description: 'Moneda del precio',
    example: 'USD'
  })
  currency: string;
}
