# 📊 Logs del Servidor Bookly

## 🚀 Estado del Servidor

**Fecha de inicio**: 21 de septiembre de 2025, 2:53:05 PM  
**Puerto**: 3000  
**Estado**: ✅ FUNCIONANDO  
**Proceso**: Ejecutándose en segundo plano con `nohup`

## 📋 Logs de Inicio del Servidor

```
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [RouterExplorer] Mapped {/api/v1/restaurants/:businessId/tables/:tableId, GET} route +0ms
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [RouterExplorer] Mapped {/api/v1/restaurants/:businessId/tables/:tableId, PUT} route +1ms
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [RouterExplorer] Mapped {/api/v1/restaurants/:businessId/tables/:tableId/activate, PUT} route +0ms
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [RouterExplorer] Mapped {/api/v1/restaurants/:businessId/tables/:tableId/deactivate, PUT} route +0ms
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [RouterExplorer] Mapped {/api/v1/restaurants/:businessId/tables/:tableId, DELETE} route +0ms
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [RouterExplorer] Mapped {/api/v1/restaurants/:businessId/tables/:tableId/availability, GET} route +0ms
[Nest] 7122  - 09/21/2025, 2:53:05 PM     LOG [NestApplication] Nest application successfully started +3ms
🚀 Bookly API running on: http://localhost:3000
📚 Swagger docs available at: http://localhost:3000/api/docs
No typescript errors found.
```

## 🔗 Endpoints Disponibles

### Hoteles
- `GET /api/v1/hotels/{businessId}/rooms` - Obtener habitaciones
- `POST /api/v1/hotels/{businessId}/rooms` - Crear habitación
- `GET /api/v1/hotels/{businessId}/rooms/{roomId}` - Obtener habitación específica
- `PUT /api/v1/hotels/{businessId}/rooms/{roomId}` - Actualizar habitación
- `DELETE /api/v1/hotels/{businessId}/rooms/{roomId}` - Eliminar habitación
- `GET /api/v1/hotels/{businessId}/rooms/availability` - Verificar disponibilidad

### Restaurantes
- `GET /api/v1/restaurants/{businessId}/tables` - Obtener mesas
- `POST /api/v1/restaurants/{businessId}/tables` - Crear mesa
- `GET /api/v1/restaurants/{businessId}/tables/{tableId}` - Obtener mesa específica
- `PUT /api/v1/restaurants/{businessId}/tables/{tableId}` - Actualizar mesa
- `DELETE /api/v1/restaurants/{businessId}/tables/{tableId}` - Eliminar mesa
- `GET /api/v1/restaurants/{businessId}/tables/availability` - Verificar disponibilidad

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `GET /api/v1/auth/profile` - Perfil del usuario

## 🛠️ Comandos de Gestión

### Ver logs en tiempo real
```bash
tail -f server.log
```

### Ver logs completos
```bash
cat server.log
```

### Verificar que está corriendo
```bash
ps aux | grep "npm run start:dev"
```

### Verificar puerto
```bash
lsof -i :3000
```

### Detener el servidor
```bash
pkill -f "npm run start:dev"
```

### Reiniciar el servidor
```bash
pkill -f "npm run start:dev" && nohup npm run start:dev > server.log 2>&1 &
```

## 📊 Métricas del Servidor

- **PID**: 7122
- **Memoria**: ~61MB
- **CPU**: 0.0%
- **Estado**: Activo (S)
- **Tiempo de ejecución**: Desde 2:53:05 PM

## 🔍 Pruebas Realizadas

### ✅ Compilación
- Proyecto compila sin errores
- No hay errores de TypeScript
- No hay errores de linting

### ✅ Endpoints
- Validación de UUIDs funcionando correctamente
- Respuestas de error apropiadas para IDs inválidos
- Estructura de respuesta JSON correcta

### ✅ Base de Datos
- Conexión a SQLite establecida
- Entidades mapeadas correctamente
- Repositorios TypeORM funcionando

## 📝 Notas Importantes

1. **Servidor persistente**: Usando `nohup` para ejecución en segundo plano
2. **Logs centralizados**: Todos los logs se guardan en `server.log`
3. **Validación activa**: Endpoints validan UUIDs correctamente
4. **Sin errores**: No se detectaron errores en el sistema
5. **Documentación**: Swagger UI disponible en `/api/docs`

---
*Última actualización: 21 de septiembre de 2025*




