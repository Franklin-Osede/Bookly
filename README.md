# 🏨 Bookly - Sistema de Gestión Inteligente para Hoteles y Restaurantes

## 📋 Descripción del Proyecto

**Bookly** es una plataforma integral de gestión de reservas que combina la potencia de la arquitectura limpia con inteligencia artificial para revolucionar la experiencia de hoteles y restaurantes. El sistema utiliza equipos de agentes de IA basados en Python y LangChain para automatizar y optimizar múltiples aspectos de la operación.

## 🎯 Funcionalidades Principales

### 🏨 **Gestión de Hoteles**
- **Gestión de Habitaciones**: Creación, actualización y administración de habitaciones
- **Tipos de Habitación**: Single, Double, Suite, Deluxe
- **Control de Disponibilidad**: Verificación en tiempo real de disponibilidad
- **Gestión de Precios**: Sistema de precios dinámicos con soporte multi-moneda
- **Análisis de Ocupación**: Métricas de ocupación y revenue management
- **Reservas Inteligentes**: Sistema de reservas con validaciones automáticas

### 🍽️ **Gestión de Restaurantes**
- **Gestión de Mesas**: Administración de mesas por ubicación (Interior, Exterior, Patio, Bar)
- **Control de Capacidad**: Gestión de capacidad por mesa y ubicación
- **Reservas de Restaurante**: Sistema de reservas con validación de disponibilidad
- **Gestión de Ubicaciones**: Organización por áreas del restaurante
- **Análisis de Utilización**: Métricas de uso de mesas y optimización

### 🤖 **Inteligencia Artificial (En Desarrollo)**
- **Agentes de IA para Hoteles**:
  - Asistente de reservas inteligente
  - Optimización de precios dinámicos
  - Predicción de demanda
  - Gestión automática de overbooking
  - Análisis de satisfacción del cliente

- **Agentes de IA para Restaurantes**:
  - Recomendaciones de menú personalizadas
  - Optimización de distribución de mesas
  - Predicción de flujo de clientes
  - Gestión automática de listas de espera
  - Análisis de preferencias gastronómicas

### 👥 **Gestión de Usuarios y Negocios**
- **Sistema de Usuarios**: Registro, autenticación y perfiles
- **Gestión de Negocios**: Registro y administración de hoteles/restaurantes
- **Sistema de Roles**: Diferentes niveles de acceso y permisos
- **Gestión de Propietarios**: Control de múltiples establecimientos

### 📊 **Analytics y Reportes**
- **Dashboard en Tiempo Real**: Métricas clave de operación
- **Reportes de Revenue**: Análisis de ingresos y rentabilidad
- **Análisis de Ocupación**: Tendencias y patrones de uso
- **Métricas de Satisfacción**: Análisis de feedback y reviews

## 🏗️ Arquitectura del Sistema

### **Backend (NestJS + TypeScript)**
```
backend/
├── src/
│   ├── shared/           # Módulos compartidos
│   │   ├── domain/       # Entidades y Value Objects
│   │   ├── application/  # Servicios y Casos de Uso
│   │   └── infrastructure/ # Repositorios y APIs externas
│   ├── hotel/           # Módulo de Hoteles
│   ├── restaurant/      # Módulo de Restaurantes
│   ├── ai/              # Módulo de IA (Python + LangChain)
│   └── admin/           # Panel de Administración
```

### **Frontend (En Desarrollo)**
- React/Angular con TypeScript
- Dashboard responsivo
- PWA para móviles

### **IA y Machine Learning (Python + LangChain)**
- **Agentes Especializados**: Cada agente maneja un aspecto específico
- **LangChain Integration**: Para procesamiento de lenguaje natural
- **APIs REST**: Comunicación entre Node.js y Python
- **Base de Datos Vectorial**: Para embeddings y búsquedas semánticas

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **NestJS**: Framework de Node.js
- **TypeScript**: Tipado estático
- **PostgreSQL**: Base de datos principal
- **TypeORM**: ORM para base de datos
- **Jest**: Testing framework
- **Swagger**: Documentación de API

### **IA y ML**
- **Python 3.9+**: Lenguaje principal para IA
- **LangChain**: Framework para aplicaciones con LLM
- **OpenAI GPT**: Modelos de lenguaje
- **Pandas/NumPy**: Análisis de datos
- **FastAPI**: API para servicios de IA
- **Redis**: Cache y colas de mensajes

### **DevOps**
- **Docker**: Containerización
- **Docker Compose**: Orquestación local
- **GitHub Actions**: CI/CD
- **AWS/GCP**: Cloud deployment

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Redis 6+
- Docker (opcional)

### **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run start:dev
```

### **IA Services Setup**
```bash
cd ai-services
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### **Base de Datos**
```bash
# Crear base de datos
createdb bookly_db

# Ejecutar migraciones
npm run migration:run
```

## 📊 Estado Actual del Proyecto

### ✅ **Completado (Fase 1)**
- [x] Arquitectura del dominio (DDD)
- [x] Entidades principales (Room, Table, Business, Reservation, User)
- [x] Value Objects (Money, Email, Address, PhoneNumber, UUID)
- [x] Servicios de aplicación
- [x] Repositorios con interfaces
- [x] Tests unitarios (100% cobertura - 432 tests pasando)
- [x] API REST con Swagger
- [x] Configuración de base de datos
- [x] Corrección completa de todos los tests

### 🔄 **En Progreso (Fase 2)**
- [ ] Implementación de controladores REST
- [ ] Middleware de autenticación
- [ ] Validaciones de entrada
- [ ] Manejo de errores
- [ ] Documentación de API

### 📋 **Próximas Fases**

#### **Fase 3: Integración con IA**
- [ ] Implementación de agentes Python
- [ ] Integración LangChain
- [ ] APIs de comunicación Node.js ↔ Python
- [ ] Agentes especializados por dominio

#### **Fase 4: Frontend**
- [ ] Dashboard de administración
- [ ] Interfaz de usuario para hoteles
- [ ] Interfaz de usuario para restaurantes
- [ ] Aplicación móvil (PWA)

#### **Fase 5: Funcionalidades Avanzadas**
- [ ] Sistema de notificaciones
- [ ] Integración con sistemas de pago
- [ ] Analytics avanzados
- [ ] Machine Learning para predicciones

#### **Fase 6: Producción**
- [ ] Optimización de performance
- [ ] Monitoreo y logging
- [ ] Backup y recuperación
- [ ] Escalabilidad horizontal

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests específicos
npm test -- --testPathPattern=reservation.service.spec.ts
```

## 📚 Documentación de API

Una vez iniciado el servidor, la documentación de Swagger estará disponible en:
- **Desarrollo**: http://localhost:3000/api/docs
- **Producción**: https://api.bookly.com/api/docs

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo Backend**: NestJS, TypeScript, DDD
- **IA/ML**: Python, LangChain, OpenAI
- **Frontend**: React/Angular (próximamente)
- **DevOps**: Docker, AWS/GCP

## 📞 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Bookly** - Revolucionando la gestión de hoteles y restaurantes con IA 🚀
