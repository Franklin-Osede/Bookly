import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './infrastructure/auth/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/auth/strategies/local.strategy';
import { UserRepository } from './application/repositories/user.repository';
import { UserRepositoryTypeORM } from './infrastructure/repositories/user.repository.typeorm';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { REPOSITORY_TOKENS } from './application/tokens/repository.tokens';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'bookly-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: UserRepositoryTypeORM,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
