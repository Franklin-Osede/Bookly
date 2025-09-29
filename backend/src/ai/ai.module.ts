import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiConversationController } from './controllers/ai-conversation.controller';
import { AiConversationService } from './application/services/ai-conversation.service';
import { LangChainConfig } from './infrastructure/langchain/langchain.config';
import { LangChainService } from './infrastructure/langchain/langchain.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AiConversationController],
  providers: [AiConversationService, LangChainConfig, LangChainService],
  exports: [AiConversationService, LangChainService],
})
export class AiModule {}
