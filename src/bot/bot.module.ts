import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [ExpensesModule],
  providers: [BotUpdate],
})
export class BotModule {}
