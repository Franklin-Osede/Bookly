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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TableService } from '../application/services/table.service';
import { CreateTableDto } from '../application/dto/create-table.dto';
import { UpdateTableDto } from '../application/dto/update-table.dto';
import { TableResponseDto } from '../application/dto/table-response.dto';
import { TableAvailabilityQueryDto } from '../application/dto/table-availability-query.dto';
import { Table } from '../domain/entities/table.entity';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly tableService: TableService) {}

  @Post(':businessId/tables')
  @ApiOperation({
    summary: 'Crear una nueva mesa',
    description: 'Crea una nueva mesa para un restaurante específico'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiResponse({
    status: 201,
    description: 'Mesa creada exitosamente',
    type: TableResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado'
  })
  @HttpCode(HttpStatus.CREATED)
  async createTable(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() createTableDto: CreateTableDto
  ): Promise<TableResponseDto> {
    const table = await this.tableService.createTable({
      businessId,
      number: createTableDto.number,
      location: createTableDto.location,
      capacity: createTableDto.capacity,
      description: createTableDto.description,
    });

    return this.mapTableToResponse(table);
  }

  @Get(':businessId/tables')
  @ApiOperation({
    summary: 'Listar mesas de un restaurante',
    description: 'Obtiene todas las mesas de un restaurante específico'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiQuery({
    name: 'location',
    description: 'Filtrar por ubicación de mesa',
    required: false,
    example: 'INDOOR'
  })
  @ApiQuery({
    name: 'minCapacity',
    description: 'Capacidad mínima',
    required: false,
    example: 4
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mesas obtenida exitosamente',
    type: [TableResponseDto]
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado'
  })
  async getTables(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('location') location?: string,
    @Query('minCapacity') minCapacity?: number
  ): Promise<TableResponseDto[]> {
    let tables: Table[];

    if (location) {
      tables = await this.tableService.getTablesByLocation(businessId, location as any);
    } else if (minCapacity) {
      tables = await this.tableService.getTablesByCapacity(businessId, minCapacity);
    } else {
      tables = await this.tableService.getTablesByBusiness(businessId);
    }

    return tables.map(table => this.mapTableToResponse(table));
  }

  @Get(':businessId/tables/availability')
  @ApiOperation({
    summary: 'Verificar disponibilidad de mesas',
    description: 'Verifica qué mesas están disponibles para una fecha y hora específica'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad verificada exitosamente',
    type: [TableResponseDto]
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de fecha inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado'
  })
  async checkTableAvailability(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: TableAvailabilityQueryDto
  ): Promise<TableResponseDto[]> {
    const reservationDate = new Date(query.reservationDate);
    const endDate = new Date(reservationDate.getTime() + query.duration * 60 * 60 * 1000);

    let tables = await this.tableService.getAvailableTables(businessId, reservationDate, endDate);

    // Aplicar filtros adicionales
    if (query.location) {
      tables = tables.filter(table => table.location === query.location);
    }
    if (query.minCapacity) {
      tables = tables.filter(table => table.capacity >= query.minCapacity);
    }

    return tables.map(table => this.mapTableToResponse(table));
  }

  @Get(':businessId/tables/:tableId')
  @ApiOperation({
    summary: 'Obtener una mesa específica',
    description: 'Obtiene los detalles de una mesa específica'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID de la mesa',
    example: 'table-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Mesa obtenida exitosamente',
    type: TableResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa no encontrada'
  })
  async getTable(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('tableId', ParseUUIDPipe) tableId: string
  ): Promise<TableResponseDto> {
    const table = await this.tableService.getTableById(tableId);
    return this.mapTableToResponse(table);
  }

  @Put(':businessId/tables/:tableId')
  @ApiOperation({
    summary: 'Actualizar una mesa',
    description: 'Actualiza los datos de una mesa específica'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID de la mesa',
    example: 'table-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Mesa actualizada exitosamente',
    type: TableResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa no encontrada'
  })
  async updateTable(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('tableId', ParseUUIDPipe) tableId: string,
    @Body() updateTableDto: UpdateTableDto
  ): Promise<TableResponseDto> {
    const table = await this.tableService.updateTable(tableId, updateTableDto);
    return this.mapTableToResponse(table);
  }

  @Put(':businessId/tables/:tableId/activate')
  @ApiOperation({
    summary: 'Activar una mesa',
    description: 'Activa una mesa que estaba desactivada'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID de la mesa',
    example: 'table-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Mesa activada exitosamente',
    type: TableResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa no encontrada'
  })
  async activateTable(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('tableId', ParseUUIDPipe) tableId: string
  ): Promise<TableResponseDto> {
    const table = await this.tableService.activateTable(tableId);
    return this.mapTableToResponse(table);
  }

  @Put(':businessId/tables/:tableId/deactivate')
  @ApiOperation({
    summary: 'Desactivar una mesa',
    description: 'Desactiva una mesa temporalmente'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID de la mesa',
    example: 'table-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Mesa desactivada exitosamente',
    type: TableResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa no encontrada'
  })
  async deactivateTable(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('tableId', ParseUUIDPipe) tableId: string
  ): Promise<TableResponseDto> {
    const table = await this.tableService.deactivateTable(tableId);
    return this.mapTableToResponse(table);
  }

  @Delete(':businessId/tables/:tableId')
  @ApiOperation({
    summary: 'Eliminar una mesa',
    description: 'Elimina permanentemente una mesa'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID de la mesa',
    example: 'table-456'
  })
  @ApiResponse({
    status: 204,
    description: 'Mesa eliminada exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa no encontrada'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTable(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('tableId', ParseUUIDPipe) tableId: string
  ): Promise<void> {
    await this.tableService.deleteTable(tableId);
  }

  @Get(':businessId/tables/:tableId/availability')
  @ApiOperation({
    summary: 'Verificar disponibilidad de una mesa específica',
    description: 'Verifica si una mesa específica está disponible para una fecha y hora'
  })
  @ApiParam({
    name: 'businessId',
    description: 'ID del restaurante',
    example: 'restaurant-123'
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID de la mesa',
    example: 'table-456'
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad verificada exitosamente',
    schema: {
      type: 'object',
      properties: {
        isAvailable: { type: 'boolean', example: true },
        table: { $ref: '#/components/schemas/TableResponseDto' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de fecha inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa no encontrada'
  })
  async checkTableSpecificAvailability(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('tableId', ParseUUIDPipe) tableId: string,
    @Query() query: TableAvailabilityQueryDto
  ): Promise<{ isAvailable: boolean; table: TableResponseDto }> {
    const reservationDate = new Date(query.reservationDate);
    const endDate = new Date(reservationDate.getTime() + query.duration * 60 * 60 * 1000);

    const isAvailable = await this.tableService.checkTableAvailability(tableId, reservationDate, endDate);
    const table = await this.tableService.getTableById(tableId);

    return {
      isAvailable,
      table: this.mapTableToResponse(table)
    };
  }

  private mapTableToResponse(table: Table): TableResponseDto {
    return {
      id: table.id,
      businessId: table.businessId,
      number: table.number,
      location: table.location,
      capacity: table.capacity,
      description: table.description,
      isActive: table.isActive,
      createdAt: table.createdAt,
      updatedAt: table.updatedAt,
    };
  }
}
