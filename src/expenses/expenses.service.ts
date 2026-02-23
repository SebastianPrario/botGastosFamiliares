import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(data: Partial<Expense>): Promise<Expense> {
    const expense = this.expensesRepository.create(data);
    return this.expensesRepository.save(expense);
  }

  async getTotalByUser(): Promise<{ userName: string; total: number }[]> {
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('expense.userName', 'userName')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.isSettled = :isSettled', { isSettled: false })
      .groupBy('expense.userName')
      .getRawMany();
    
    return result.map(r => ({
      userName: r.userName,
      total: parseFloat(r.total)
    }));
  }

  async getMonthlyTotalsByCategory(): Promise<{ category: string; total: number }[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.createdAt BETWEEN :start AND :end', { 
        start: startOfMonth, 
        end: endOfMonth 
      })
      .groupBy('expense.category')
      .getRawMany();

    return result.map(r => ({
      category: r.category,
      total: parseFloat(r.total)
    }));
  }

  async clearAll(): Promise<void> {
    await this.expensesRepository.update({ isSettled: false }, { isSettled: true });
  }
}
