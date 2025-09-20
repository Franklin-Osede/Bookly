# 🤖🏨🍽️ Bookly - Asistente Inteligente de Reservas Multicanal

## 📋 Descripción del Proyecto

**Bookly** es un asistente inteligente de reservas multicanal que revoluciona la forma en que hoteles y restaurantes gestionan sus reservas. Con capacidades de IA conversacional, Bookly permite a los clientes hacer reservas de forma natural a través de múltiples canales, mientras que los negocios pueden automatizar su atención al cliente y aumentar sus ventas.

### 🌟 **Diferenciadores Clave**
- **Conversación Natural**: Los clientes hablan con Bookly como si fuera un humano
- **Multicanal**: Web, WhatsApp, Instagram DM, y voz 24/7
- **Multi-idioma**: Respuestas automáticas en el idioma del cliente
- **Upselling Inteligente**: Sugerencias automáticas para aumentar ventas
- **Sin Over-engineering**: Solución simple pero poderosa

## 📲 Funcionalidades Core de Bookly (MVP)

### 👉 **Comunes para Hoteles y Restaurantes (Core Compartido)**
- **Reservas Conversacionales Multicanal**
  - Web (chat widget o QR)
  - WhatsApp / Instagram DM
  - (Hoteles) también por voz 24/7
- **Gestión de Disponibilidad**
  - Restaurantes → mesas, turnos de 2h, máximo personas
  - Hoteles → habitaciones, check-in/out, fechas de estancia
- **Confirmación + Recordatorios Automáticos**
  - Código de reserva único
  - Mensaje de confirmación vía WhatsApp/email
  - Recordatorio automático (24h antes)
- **Calendario del Negocio**
  - Panel simple para ver reservas del día/semana
  - Bloquear fechas (festivos, eventos privados)

## 🌟 Diferenciadores IA (Sin Complicarse)

### 🔹 **Para Restaurantes**
- **Conversación Natural**: Cliente dice "Mesa para 4 mañana a las 21h" → Bookly entiende y propone alternativas
- **Menú IA (QR en mesa)**: Cliente escanea QR y pregunta "¿Qué hay sin gluten?", "Quiero algo bajo en calorías"
- **Upselling Automático**: Agente sugiere menú degustación, maridajes o extras

### 🔹 **Para Hoteles**
- **Agente de Voz 24/7**: Cliente llama y el bot responde en varios idiomas
- **Conserje Digital**: "¿A qué hora es el desayuno?", "¿Tienen parking?", "¿Hay tours cerca?"
- **Multi-idioma Automático**: IA responde en el idioma del huésped
- **Upselling Simple**: "¿Quieres añadir desayuno por 12€?" o "Habitación con vista al mar por +30€"

## 🚀 Por qué Bookly es Diferencial

### 🎯 **Problema Actual**
- **Booking, TheFork, OpenTable**: Formularios planos y rígidos
- **Atención al cliente**: Limitada a horarios de oficina
- **Idiomas**: Requiere staff políglota
- **Upselling**: Manual y dependiente del personal

### ✅ **Solución Bookly**
- **Conversación Natural**: Cliente habla como con un humano
- **24/7**: Asistente que nunca duerme
- **Multi-idioma**: IA responde automáticamente
- **Upselling Automático**: Sugerencias inteligentes
- **Sin Over-engineering**: Solución simple pero poderosa

### 💡 **Valor para el Negocio**
- **Más Reservas Directas**: Sin comisiones de terceros
- **Atención 24/7**: Sin costos de personal adicional
- **Multi-idioma**: Atrae clientes internacionales
- **Upselling**: Aumenta el ticket promedio
- **Eficiencia**: Libera tiempo del staff para tareas importantes

## 🎯 Funcionalidades Técnicas Principales

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

### 🔄 **En Progreso (Fase 2 - MVP)**
- [x] **HotelController** implementado con endpoints REST
- [x] DTOs y validaciones básicas
- [ ] Sistema de autenticación JWT
- [ ] Panel básico de reservas
- [ ] Chat widget web
- [ ] Integración WhatsApp básica
- [ ] Confirmaciones automáticas

### 📋 **Próximas Fases**

#### **Fase 3: Diferenciadores IA (1 mes)**
- [ ] **Para Restaurantes**: Menú IA con QR
- [ ] **Para Hoteles**: Agente de voz 24/7
- [ ] Multi-idioma automático
- [ ] Upselling inteligente
- [ ] Conserje digital (FAQs)
- [ ] Integración LangChain

#### **Fase 4: Frontend y UX**
- [ ] Dashboard de administración
- [ ] Interfaz de usuario para clientes
- [ ] Chat widget integrado
- [ ] Diseño responsive y PWA

#### **Fase 5: Canales Avanzados**
- [ ] Instagram DM bot
- [ ] Sistema de notificaciones push
- [ ] Email marketing automatizado
- [ ] SMS y llamadas de voz

#### **Fase 6: Escalabilidad (A demanda)**
- [ ] Integraciones PMS/POS
- [ ] Caching con Redis
- [ ] Monitoreo y logging
- [ ] CI/CD pipeline
- [ ] Optimización de performance

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
