import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense } from './expense.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() data: Partial<Expense>) {
    return this.expensesService.create(data);
  }

  @Get('totals')
  getTotalByUser() {
    return this.expensesService.getTotalByUser();
  }

  @Get('monthly-summary')
  getMonthlyTotalsByCategory() {
    return this.expensesService.getMonthlyTotalsByCategory();
  }

  @Delete()
  clearAll() {
    return this.expensesService.clearAll();
  }
}
