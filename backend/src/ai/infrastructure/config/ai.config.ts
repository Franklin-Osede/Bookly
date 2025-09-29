import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
  },
  langchain: {
    enableFallback: process.env.LANGCHAIN_ENABLE_FALLBACK === 'true',
    timeout: parseInt(process.env.LANGCHAIN_TIMEOUT || '30000'),
  },
}));
