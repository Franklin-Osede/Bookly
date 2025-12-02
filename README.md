# Bookly – Intelligent Multi-Channel Reservation Platform

> **Enterprise-grade reservation management system** featuring AI-powered conversational booking, NestJS microservices backend, Angular frontend, and PostgreSQL database infrastructure.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat&logo=langchain&logoColor=white)](https://www.langchain.com/)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Domain-Driven Design](#domain-driven-design)
- [Security](#security)
- [License](#license)

---

## Overview

Bookly is a production-ready intelligent reservation booking platform designed for hotels and restaurants. The system enables businesses to automate customer service, increase direct bookings, and provide 24/7 multilingual support through AI-powered conversational interfaces.

### Key Features

- **AI-Powered Conversations**: Natural language processing for booking requests via multiple channels
- **Multi-Business Support**: Unified platform for hotels and restaurants with specialized modules
- **Real-time Availability**: Live availability checking for rooms and tables
- **Domain-Driven Design**: Clean architecture with rich domain models and value objects
- **RESTful API**: Comprehensive API with Swagger documentation
- **JWT Authentication**: Secure authentication and authorization system
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Comprehensive Testing**: High test coverage with Jest

### Core Capabilities

**Hotel Management:**
- Room creation, update, and administration
- Room type management (Single, Double, Suite, Deluxe)
- Real-time availability verification
- Dynamic pricing with multi-currency support
- Occupancy analysis and revenue management

**Restaurant Management:**
- Table management by location (Interior, Exterior, Patio, Bar)
- Capacity control per table and location
- Reservation validation with availability checks
- Location-based organization
- Table utilization metrics

**AI Integration:**
- LangChain-powered natural language processing
- Conversational reservation extraction
- Intelligent response generation
- Context-aware conversation handling

**Reservation System:**
- Hotel and restaurant reservation management
- Reservation status workflow (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- User reservation history and filtering
- Reservation confirmation and cancellation

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Frontend                         │
│         (Dashboard, Business Management, Reservations)       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              NestJS Backend API                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Hotel   │  │Restaurant│  │    AI    │  │  Shared  │   │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │             │             │             │
┌───────▼─────────────▼─────────────▼─────────────▼──────────┐
│              Domain Layer (DDD)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Entities│  │   Value  │  │ Services │  │Repositor│   │
│  │          │  │  Objects │  │          │  │   ies    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ TypeORM  │  │   JWT    │  │ LangChain│  │  Passport│   │
│  │          │  │   Auth   │  │          │  │          │   │
│  └────┬─────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────┼──────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │Businesses│  │Reservatio│  │  Rooms   │   │
│  │          │  │          │  │    ns    │  │  Tables  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- NestJS 11 with TypeScript 5.9
- TypeORM 0.3 for database operations
- PostgreSQL 13+ as primary database
- Passport.js with JWT strategy for authentication
- LangChain for AI conversation processing
- Swagger/OpenAPI for API documentation
- Jest for testing

**Frontend:**
- Angular 20 with TypeScript
- Angular Material for UI components
- RxJS for reactive programming
- HTTP client with interceptors

**AI & Machine Learning:**
- LangChain 0.3 for LLM integration
- OpenAI GPT models via LangChain
- Natural language understanding for reservation extraction
- Context-aware conversation management

**Development Tools:**
- TypeScript for type safety
- ESLint and Prettier for code quality
- Jest for unit and integration testing
- Swagger for API documentation

---

## Project Structure

```
bookly/
├── backend/                          # NestJS Backend API
│   ├── src/
│   │   ├── shared/                   # Shared module (DDD)
│   │   │   ├── domain/
│   │   │   │   ├── entities/        # Domain entities (User, Business, Reservation)
│   │   │   │   └── value-objects/    # Value Objects (Money, Email, PhoneNumber, Address, UUID, DateRange)
│   │   │   ├── application/
│   │   │   │   ├── services/         # Application services
│   │   │   │   ├── repositories/     # Repository interfaces
│   │   │   │   └── tokens/           # Dependency injection tokens
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   │   └── entities/    # TypeORM entities
│   │   │   │   ├── repositories/     # Repository implementations
│   │   │   │   └── auth/             # Authentication (JWT, Passport)
│   │   │   └── controllers/          # REST controllers
│   │   ├── hotel/                    # Hotel module
│   │   │   ├── domain/
│   │   │   │   └── entities/        # Room entity
│   │   │   ├── application/
│   │   │   │   ├── services/        # Room service
│   │   │   │   └── repositories/    # Room repository interface
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   │   └── entities/    # Room TypeORM entity
│   │   │   │   └── repositories/    # Room repository implementation
│   │   │   └── controllers/         # Hotel REST controller
│   │   ├── restaurant/              # Restaurant module
│   │   │   ├── domain/
│   │   │   │   └── entities/        # Table entity
│   │   │   ├── application/
│   │   │   │   ├── services/        # Table service
│   │   │   │   └── repositories/    # Table repository interface
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   │   └── entities/    # Table TypeORM entity
│   │   │   │   └── repositories/    # Table repository implementation
│   │   │   └── controllers/         # Restaurant REST controller
│   │   ├── ai/                      # AI module
│   │   │   ├── application/
│   │   │   │   ├── services/        # AI conversation service
│   │   │   │   └── dto/             # Conversation DTOs
│   │   │   ├── infrastructure/
│   │   │   │   └── langchain/       # LangChain integration
│   │   │   └── controllers/         # AI conversation controller
│   │   ├── admin/                   # Admin module
│   │   ├── app.module.ts            # Root module
│   │   └── main.ts                  # Application bootstrap
│   ├── test/                        # Test files
│   ├── jest.config.js               # Jest configuration
│   └── package.json
│
├── frontend/                         # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                # Core module
│   │   │   │   ├── components/      # Core components (layout, etc.)
│   │   │   │   ├── services/        # Core services (auth, API, etc.)
│   │   │   │   ├── guards/          # Route guards
│   │   │   │   └── models/          # Core models
│   │   │   ├── features/            # Feature modules
│   │   │   │   ├── auth/            # Authentication feature
│   │   │   │   ├── business/       # Business management
│   │   │   │   ├── dashboard/      # Dashboard
│   │   │   │   └── reservations/   # Reservation management
│   │   │   ├── shared/             # Shared components
│   │   │   └── routes/             # Route configuration
│   │   └── styles.scss              # Global styles
│   ├── angular.json                 # Angular configuration
│   └── package.json
│
├── docs/                             # Documentation
│   └── server-logs.md               # Server logs documentation
│
└── package.json                     # Root package.json (LangChain dependencies)
```

---

## Technology Stack

### Backend Dependencies

**Core Framework:**
- `@nestjs/common`: ^11.1.6
- `@nestjs/core`: ^11.1.6
- `@nestjs/platform-express`: ^11.1.6
- `@nestjs/config`: ^4.0.2

**Database & ORM:**
- `@nestjs/typeorm`: ^11.0.0
- `typeorm`: ^0.3.26
- `pg`: ^8.16.3

**Authentication:**
- `@nestjs/jwt`: ^11.0.0
- `@nestjs/passport`: ^11.0.5
- `passport`: ^0.7.0
- `passport-jwt`: ^4.0.1
- `passport-local`: ^1.0.0
- `bcryptjs`: ^3.0.2

**AI & Machine Learning:**
- `langchain`: ^0.3.34
- `@langchain/core`: ^0.3.77
- `@langchain/community`: ^0.3.56
- `@langchain/openai`: ^0.6.13
- `@langchain/langgraph`: ^0.4.9

**API Documentation:**
- `@nestjs/swagger`: ^11.2.0

**Utilities:**
- `class-validator`: ^0.14.2
- `class-transformer`: ^0.5.1
- `uuid`: ^9.0.1

### Frontend Dependencies

**Core Framework:**
- `@angular/core`: ^20.3.0
- `@angular/common`: ^20.3.2
- `@angular/router`: ^20.3.2
- `@angular/forms`: ^20.3.2

**UI Components:**
- `@angular/material`: ^20.2.5
- `@angular/cdk`: ^20.2.5

**Reactive Programming:**
- `rxjs`: ~7.8.0

---

## Getting Started

### Prerequisites

- **Node.js**: v18+ and npm
- **PostgreSQL**: 13+ (database server)
- **TypeScript**: 5.9+ (comes with Node.js)
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bookly

# Install root dependencies (LangChain)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

**Backend Configuration:**

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=bookly_db

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# OpenAI Configuration (for AI module)
OPENAI_API_KEY=your_openai_api_key
```

**Database Setup:**

```bash
# Create PostgreSQL database
createdb bookly_db

# The application will automatically synchronize schema in development mode
# (synchronize: true is set in app.module.ts for non-production environments)
```

### Local Development

**Backend Development:**

```bash
cd backend

# Start development server with hot reload
npm run start:dev

# API will be available at http://localhost:3000
# Swagger documentation at http://localhost:3000/api/docs
```

**Frontend Development:**

```bash
cd frontend

# Start Angular development server
npm start

# Frontend will be available at http://localhost:4200
```

**Run Tests:**

```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:cov            # Run tests with coverage

# Frontend tests
cd frontend
npm test                    # Run Angular tests
```

---

## Development

### Backend Development

The backend follows Domain-Driven Design (DDD) principles with clear separation of concerns:

**Domain Layer:**
- **Entities**: Core business objects (User, Business, Reservation, Room, Table)
- **Value Objects**: Immutable objects (Money, Email, PhoneNumber, Address, UUID, DateRange)
- **Domain Services**: Business logic that doesn't belong to a single entity

**Application Layer:**
- **Services**: Use cases and application services
- **Repository Interfaces**: Abstraction for data access
- **DTOs**: Data transfer objects for API communication

**Infrastructure Layer:**
- **TypeORM Entities**: Database schema definitions
- **Repository Implementations**: Concrete data access implementations
- **External Services**: LangChain, authentication providers

**Presentation Layer:**
- **Controllers**: REST API endpoints
- **Guards**: Authentication and authorization
- **Pipes**: Request validation and transformation

**Key Endpoints:**

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/hotels/:businessId/rooms` - Get hotel rooms
- `POST /api/v1/hotels/:businessId/rooms` - Create room
- `GET /api/v1/hotels/:businessId/rooms/availability` - Check room availability
- `GET /api/v1/restaurants/:businessId/tables` - Get restaurant tables
- `POST /api/v1/restaurants/:businessId/tables` - Create table
- `GET /api/v1/restaurants/:businessId/tables/:tableId/availability` - Check table availability
- `POST /api/v1/reservations/hotel` - Create hotel reservation
- `POST /api/v1/reservations/restaurant` - Create restaurant reservation
- `GET /api/v1/reservations` - Get user reservations
- `POST /api/v1/ai/conversation` - Process AI conversation

### Frontend Development

The frontend is built with Angular 20 using a feature-based module structure:

**Core Module:**
- Layout components
- Authentication service
- API service
- Route guards
- Core models

**Feature Modules:**
- **Auth**: Login, registration, authentication flow
- **Business**: Business management and configuration
- **Dashboard**: Main dashboard with metrics
- **Reservations**: Reservation management interface

**Shared Module:**
- Reusable components
- Shared utilities
- Common directives and pipes

### AI Module Development

The AI module integrates LangChain for natural language processing:

**Conversation Flow:**
1. User sends natural language message
2. LangChain extracts structured reservation data
3. System validates and processes reservation request
4. AI generates contextual response
5. System returns response with suggestions

**Key Components:**
- `AiConversationService`: Main service for processing conversations
- `LangChainService`: LangChain integration and LLM communication
- `LangChainConfig`: Configuration for LangChain models

---

## API Documentation

The API is fully documented using Swagger/OpenAPI. Once the backend server is running:

**Development:**
- Swagger UI: `http://localhost:3000/api/docs`
- API Base URL: `http://localhost:3000/api/v1`

**API Features:**
- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Interactive API testing

**Authentication:**
- JWT Bearer token authentication
- Token obtained via `/api/v1/auth/login`
- Include token in `Authorization: Bearer <token>` header

---

## Testing

### Test Strategy

**Unit Tests:**
- Domain entities and value objects
- Application services
- Repository implementations
- Utility functions

**Integration Tests:**
- Controller endpoints
- Database operations
- Authentication flows
- AI conversation processing

**Test Coverage:**
- High test coverage maintained across the codebase
- Domain logic has comprehensive test coverage
- Value objects are fully tested

### Running Tests

```bash
# Backend - Run all tests
cd backend
npm test

# Backend - Run tests with coverage
npm run test:cov

# Backend - Run tests in watch mode
npm run test:watch

# Backend - Run specific test file
npm test -- reservation.service.spec.ts

# Frontend - Run Angular tests
cd frontend
npm test
```

### Test Structure

Tests are organized to mirror the source code structure:

```
backend/
├── src/
│   └── [module]/
│       └── [component].ts
└── test/
    └── [module]/
        └── [component].spec.ts
```

---

## Domain-Driven Design

### Domain Entities

**User:**
- Represents system users (ADMIN, BUSINESS_OWNER, CUSTOMER)
- Manages authentication and authorization
- Links to businesses and reservations

**Business:**
- Represents hotels or restaurants
- Contains business information and configuration
- Links to rooms/tables and reservations

**Reservation:**
- Represents hotel or restaurant reservations
- Manages reservation lifecycle (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- Contains booking details and pricing

**Room (Hotel):**
- Represents hotel rooms
- Manages room types, capacity, and pricing
- Tracks availability

**Table (Restaurant):**
- Represents restaurant tables
- Manages table location, capacity, and status
- Tracks availability

### Value Objects

**Money:**
- Immutable monetary value with currency
- Supports arithmetic operations (add, subtract, multiply, divide)
- Validates currency codes (USD, EUR, GBP, JPY, CAD, AUD)
- Provides formatted string representation

**Email:**
- Validated email address
- Normalized to lowercase
- Strict format validation with TLD requirement

**PhoneNumber:**
- International phone number format
- Country code extraction
- National number formatting
- Country-specific validation (US, UK, FR)

**Address:**
- Structured address information
- Validation and normalization

**UUID:**
- Universally unique identifier
- Validation and generation

**DateRange:**
- Date range with start and end dates
- Validation and duration calculation

### Repository Pattern

The application uses the Repository pattern to abstract data access:

- **Repository Interfaces**: Defined in application layer
- **Repository Implementations**: TypeORM-based implementations in infrastructure layer
- **Dependency Injection**: Tokens used for loose coupling

---

## Security

### Authentication & Authorization

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password encryption
- **Route Guards**: Protected routes with JWT validation
- **Role-Based Access**: User roles (ADMIN, BUSINESS_OWNER, CUSTOMER)

### Data Validation

- **Class Validator**: Request validation using decorators
- **Value Object Validation**: Domain-level validation in value objects
- **Type Safety**: Full TypeScript type checking

### API Security

- **CORS Configuration**: Configured for allowed origins
- **Input Validation**: Whitelist validation with `forbidNonWhitelisted`
- **SQL Injection Prevention**: TypeORM parameterized queries
- **XSS Protection**: Input sanitization and validation

---

## License

**Private** – Bookly

All rights reserved. This software is proprietary and confidential.

---

## Support

For technical support or questions:

- **API Documentation**: See Swagger UI at `/api/docs`
- **Backend Logs**: Check console output or log files
- **Database Issues**: Verify PostgreSQL connection and schema

---

**Built for hotels and restaurants**
