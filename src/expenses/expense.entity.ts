import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column()
  userName: string;

  @Column({ default: false })
  isSettled: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
