import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { ExpensesModule } from './expenses/expenses.module';
import { BotModule } from './bot/bot.module';
import { Expense } from './expenses/expense.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.get<string>('DATABASE_URL'),
        entities: [Expense],
        synchronize: true, // Solo para desarrollo
        ssl: configService.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
        launchOptions: configService.get<string>('WEBHOOK_DOMAIN') ? {
          webhook: {
            domain: configService.get<string>('WEBHOOK_DOMAIN') || '',
            hookPath: '/api/webhook',
          },
        } : undefined,
      }),
      inject: [ConfigService],
    }),
    ExpensesModule,
    BotModule,
  ],
})
export class AppModule {}
