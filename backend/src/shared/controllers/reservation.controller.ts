import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationService } from '../application/services/reservation.service';
import { JwtAuthGuard } from '../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../infrastructure/auth/decorators/current-user.decorator';
import { User } from '../domain/entities/user.entity';
import { Money } from '../domain/value-objects/money';
import { CreateHotelReservationDto } from './dto/create-hotel-reservation.dto';
import { CreateRestaurantReservationDto } from './dto/create-restaurant-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('hotel')
  @ApiOperation({
    summary: 'Crear reserva de hotel',
    description: 'Crea una nueva reserva de habitación de hotel'
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de reserva inválidos'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado'
  })
  async createHotelReservation(
    @Body() createHotelReservationDto: CreateHotelReservationDto,
    @CurrentUser() user: User
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationService.createHotelReservation({
      ...createHotelReservationDto,
      userId: user.id,
      startDate: new Date(createHotelReservationDto.startDate),
      endDate: new Date(createHotelReservationDto.endDate),
      totalAmount: new Money(createHotelReservationDto.totalAmount.amount, createHotelReservationDto.totalAmount.currency)
    });
    
    return this.mapToResponseDto(reservation);
  }

  @Post('restaurant')
  @ApiOperation({
    summary: 'Crear reserva de restaurante',
    description: 'Crea una nueva reserva de mesa de restaurante'
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de reserva inválidos'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado'
  })
  async createRestaurantReservation(
    @Body() createRestaurantReservationDto: CreateRestaurantReservationDto,
    @CurrentUser() user: User
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationService.createRestaurantReservation({
      ...createRestaurantReservationDto,
      userId: user.id,
      startDate: new Date(createRestaurantReservationDto.startDate),
      endDate: new Date(createRestaurantReservationDto.endDate),
      totalAmount: new Money(createRestaurantReservationDto.totalAmount.amount, createRestaurantReservationDto.totalAmount.currency)
    });
    
    return this.mapToResponseDto(reservation);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener reservas del usuario',
    description: 'Obtiene todas las reservas del usuario autenticado'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado de reserva',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo de reserva',
    enum: ['HOTEL', 'RESTAURANT']
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas obtenida exitosamente',
    type: [ReservationResponseDto]
  })
  async getUserReservations(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('type') type?: string
  ): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationService.findByUserId(user.id);
    
    let filteredReservations = reservations;
    
    if (status) {
      filteredReservations = filteredReservations.filter(r => r.status === status);
    }
    
    if (type) {
      filteredReservations = filteredReservations.filter(r => r.type === type);
    }
    
    return filteredReservations.map(reservation => this.mapToResponseDto(reservation));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener reserva por ID',
    description: 'Obtiene una reserva específica por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva obtenida exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  async getReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationService.findById(id);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verificar que la reserva pertenece al usuario
    if (reservation.userId !== user.id) {
      throw new Error('Unauthorized access to reservation');
    }
    
    return this.mapToResponseDto(reservation);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar reserva',
    description: 'Actualiza una reserva existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  async updateReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: User
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationService.findById(id);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    if (reservation.userId !== user.id) {
      throw new Error('Unauthorized access to reservation');
    }
    
    const updatedReservation = await this.reservationService.update(id, updateReservationDto);
    return this.mapToResponseDto(updatedReservation);
  }

  @Put(':id/confirm')
  @ApiOperation({
    summary: 'Confirmar reserva',
    description: 'Confirma una reserva pendiente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva confirmada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  async confirmReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationService.findById(id);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    if (reservation.userId !== user.id) {
      throw new Error('Unauthorized access to reservation');
    }
    
    const confirmedReservation = await this.reservationService.confirmReservation(id);
    return this.mapToResponseDto(confirmedReservation);
  }

  @Put(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar reserva',
    description: 'Cancela una reserva existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  async cancelReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationService.findById(id);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    if (reservation.userId !== user.id) {
      throw new Error('Unauthorized access to reservation');
    }
    
    const cancelledReservation = await this.reservationService.cancelReservation(id);
    return this.mapToResponseDto(cancelledReservation);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar reserva',
    description: 'Elimina una reserva existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 204,
    description: 'Reserva eliminada exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  async deleteReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<void> {
    const reservation = await this.reservationService.findById(id);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    if (reservation.userId !== user.id) {
      throw new Error('Unauthorized access to reservation');
    }
    
    await this.reservationService.delete(id);
  }

  private mapToResponseDto(reservation: any): ReservationResponseDto {
    return {
      id: reservation.id,
      userId: reservation.userId,
      businessId: reservation.businessId,
      roomId: reservation.roomId,
      tableId: reservation.tableId,
      type: reservation.type,
      status: reservation.status,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      guests: reservation.guests,
      totalAmount: {
        amount: reservation.totalAmount.amount,
        currency: reservation.totalAmount.currency
      },
      notes: reservation.notes,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    };
  }
}
