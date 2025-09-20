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
import { RoomService } from '../application/services/room.service';
import { CreateRoomDto } from '../application/dto/create-room.dto';
import { UpdateRoomDto } from '../application/dto/update-room.dto';
import { RoomResponseDto } from '../application/dto/room-response.dto';
import { AvailabilityQueryDto } from '../application/dto/availability-query.dto';
import { Room } from '../domain/entities/room.entity';
import { Money } from '../../shared/domain/value-objects/money';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelController {
  constructor(private readonly roomService: RoomService) {}

  @Post(':businessId/rooms')
  @ApiOperation({
    summary: 'Crear una nueva habitación',
    description: 'Crea una nueva habitación para un hotel específico'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiResponse({
    status: 201,
    description: 'Habitación creada exitosamente',
    type: RoomResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel no encontrado'
  })
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() createRoomDto: CreateRoomDto
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.createRoom({
      businessId,
      number: createRoomDto.number,
      type: createRoomDto.type,
      capacity: createRoomDto.capacity,
      price: new Money(createRoomDto.price, createRoomDto.currency),
      description: createRoomDto.description,
    });

    return this.mapRoomToResponse(room);
  }

  @Get(':businessId/rooms')
  @ApiOperation({
    summary: 'Listar habitaciones de un hotel',
    description: 'Obtiene todas las habitaciones de un hotel específico'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiQuery({
    name: 'type',
    description: 'Filtrar por tipo de habitación',
    required: false,
    example: 'SINGLE'
  })
  @ApiQuery({
    name: 'minCapacity',
    description: 'Capacidad mínima',
    required: false,
    example: 2
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de habitaciones obtenida exitosamente',
    type: [RoomResponseDto]
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel no encontrado'
  })
  async getRooms(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('type') type?: string,
    @Query('minCapacity') minCapacity?: number
  ): Promise<RoomResponseDto[]> {
    let rooms: Room[];

    if (type) {
      rooms = await this.roomService.getRoomsByType(businessId, type as any);
    } else if (minCapacity) {
      rooms = await this.roomService.getRoomsByCapacity(businessId, minCapacity);
    } else {
      rooms = await this.roomService.getRoomsByBusiness(businessId);
    }

    return rooms.map(room => this.mapRoomToResponse(room));
  }

  @Get(':businessId/rooms/availability')
  @ApiOperation({
    summary: 'Verificar disponibilidad de habitaciones',
    description: 'Verifica qué habitaciones están disponibles en un rango de fechas'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad verificada exitosamente',
    type: [RoomResponseDto]
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de fecha inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel no encontrado'
  })
  async checkAvailability(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: AvailabilityQueryDto
  ): Promise<RoomResponseDto[]> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    let rooms = await this.roomService.getAvailableRooms(businessId, startDate, endDate);

    // Aplicar filtros adicionales
    if (query.type) {
      rooms = rooms.filter(room => room.type === query.type);
    }
    if (query.minCapacity) {
      rooms = rooms.filter(room => room.capacity >= query.minCapacity);
    }
    if (query.maxPrice) {
      rooms = rooms.filter(room => room.price.amount <= query.maxPrice);
    }

    return rooms.map(room => this.mapRoomToResponse(room));
  }

  @Get(':businessId/rooms/:roomId')
  @ApiOperation({
    summary: 'Obtener una habitación específica',
    description: 'Obtiene los detalles de una habitación específica'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la habitación',
    example: 'room-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Habitación obtenida exitosamente',
    type: RoomResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Habitación no encontrada'
  })
  async getRoom(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.getRoomById(roomId);
    return this.mapRoomToResponse(room);
  }

  @Put(':businessId/rooms/:roomId')
  @ApiOperation({
    summary: 'Actualizar una habitación',
    description: 'Actualiza los datos de una habitación específica'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la habitación',
    example: 'room-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Habitación actualizada exitosamente',
    type: RoomResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Habitación no encontrada'
  })
  async updateRoom(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() updateRoomDto: UpdateRoomDto
  ): Promise<RoomResponseDto> {
    const updateData: any = { ...updateRoomDto };
    
    if (updateRoomDto.price !== undefined && updateRoomDto.currency) {
      updateData.price = new Money(updateRoomDto.price, updateRoomDto.currency);
    }

    const room = await this.roomService.updateRoom(roomId, updateData);
    return this.mapRoomToResponse(room);
  }

  @Put(':businessId/rooms/:roomId/activate')
  @ApiOperation({
    summary: 'Activar una habitación',
    description: 'Activa una habitación que estaba desactivada'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la habitación',
    example: 'room-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Habitación activada exitosamente',
    type: RoomResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Habitación no encontrada'
  })
  async activateRoom(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.activateRoom(roomId);
    return this.mapRoomToResponse(room);
  }

  @Put(':businessId/rooms/:roomId/deactivate')
  @ApiOperation({
    summary: 'Desactivar una habitación',
    description: 'Desactiva una habitación temporalmente'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la habitación',
    example: 'room-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Habitación desactivada exitosamente',
    type: RoomResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Habitación no encontrada'
  })
  async deactivateRoom(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.deactivateRoom(roomId);
    return this.mapRoomToResponse(room);
  }

  @Delete(':businessId/rooms/:roomId')
  @ApiOperation({
    summary: 'Eliminar una habitación',
    description: 'Elimina permanentemente una habitación'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la habitación',
    example: 'room-456'
  })
  @ApiResponse({
    status: 204,
    description: 'Habitación eliminada exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Habitación no encontrada'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string
  ): Promise<void> {
    await this.roomService.deleteRoom(roomId);
  }

  @Get(':businessId/rooms/:roomId/availability')
  @ApiOperation({
    summary: 'Verificar disponibilidad de una habitación específica',
    description: 'Verifica si una habitación específica está disponible en un rango de fechas'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del hotel',
    example: 'hotel-123'
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la habitación',
    example: 'room-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad verificada exitosamente',
    schema: {
      type: 'object',
      properties: {
        isAvailable: { type: 'boolean', example: true },
        room: { $ref: '#/components/schemas/RoomResponseDto' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de fecha inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Habitación no encontrada'
  })
  async checkRoomAvailability(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query() query: AvailabilityQueryDto
  ): Promise<{ isAvailable: boolean; room: RoomResponseDto }> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    const isAvailable = await this.roomService.checkRoomAvailability(roomId, startDate, endDate);
    const room = await this.roomService.getRoomById(roomId);

    return {
      isAvailable,
      room: this.mapRoomToResponse(room)
    };
  }

  private mapRoomToResponse(room: Room): RoomResponseDto {
    return {
      id: room.id,
      businessId: room.businessId,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price.amount,
      currency: room.price.currency,
      description: room.description,
      isActive: room.isActive,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
