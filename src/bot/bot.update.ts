import { Update, Start, Help, On, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ExpensesService } from '../expenses/expenses.service';
import { ConfigService } from '@nestjs/config';

@Update()
export class BotUpdate {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly configService: ConfigService,
  ) {}

  private isAuthorized(ctx: Context): boolean {
    const authorizedStr = this.configService.get<string>('AUTHORIZED_USERS') || '';
    const authorizedIds = authorizedStr.split(',').map(id => id.trim());
    const userId = ctx.from?.id.toString();
    return userId ? authorizedIds.includes(userId) : false;
  }
  private formatMoney(amount: number): string {
  return amount.toLocaleString('es-AR', 
    { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(
      '¡Hola! Soy tu asistente de gastos familiares.\n\n' +
      'Comandos disponibles:\n' +
      '/gasto [categoría] [monto] - Registrar un gasto\n' +
      '/total - Ver el total acumulado por integrante\n' +
      '/resumen - Ver totales del mes por categoría\n' +
      '/cancelado - Borrar todos los registros (Cuidado)\n' +
      '/borrar - Borrar todos los registros (Cuidado)\n' +
      '/help - Ver este mensaje nuevamente'
    );
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await this.onStart(ctx);
  }

  @Command('gasto')
  async onGasto(@Ctx() ctx: Context) {
    if (!this.isAuthorized(ctx)) {
      return ctx.reply('No estás autorizado para usar este bot.');
    }

    // El formato es: /gasto Categoría Monto 
    const text = (ctx.message as any).text;
    const parts = text.split(' ').slice(1);

    if (parts.length < 2) {
      return ctx.reply('Formato incorrecto. Uso: /gasto [categoría] [monto]');
    }

    const category = parts[0];
    const amount = parseFloat(parts[1]);

    if (isNaN(amount)) {
      return ctx.reply('El monto debe ser un número válido.');
    }

    if (!ctx.from) {
      return ctx.reply('Error: No se pudo identificar al usuario.');
    }

    try {
      await this.expensesService.create({
        category,
        amount,
        userId: ctx.from.id,
        userName: ctx.from.first_name || ctx.from.username || 'Anonimo',
      });
      await ctx.reply(`✅ Gasto registrado: ${category} - $${this.formatMoney(amount)}`);
    } catch (error) {
      await ctx.reply('❌ Error al guardar el gasto.');
    }
  }

  @Command('total')
  async onTotal(@Ctx() ctx: Context) {
    if (!this.isAuthorized(ctx)) return ctx.reply('No autorizado.');

    const totals = await this.expensesService.getTotalByUser();
    if (totals.length === 0) {
      return ctx.reply('No hay gastos registrados aún.');
    }
    const diferencia = totals[0].total > totals[1].total ? totals[0].total - totals[1].total : totals[1].total - totals[0].total;
    
    const message = totals
      .map(t => `${t.userName}: $${this.formatMoney(t.total)}`)
      .join('\n');
    
    await ctx.reply(`📊 TOTAL ACUMULADO POR INTEGRANTE:\n\n${message}\n\nDiferencia: $${this.formatMoney(diferencia)}\n\nA Cancelar: $${this.formatMoney(diferencia/2)}`);
  }

  @Command('resumen')
  async onResumen(@Ctx() ctx: Context) {
    if (!this.isAuthorized(ctx)) return ctx.reply('No autorizado.');

    const totals = await this.expensesService.getMonthlyTotalsByCategory();
    if (totals[0].length === 0) {
      return ctx.reply('No hay gastos registrados este mes.');
    }
    const total = totals[0].reduce((acc, t) => acc + t.total, 0);
    const message = totals[0]
      .map(t => `${t.category}: $${this.formatMoney(t.total)}`)
      .join('\n');
    const month = totals[1].toLocaleString('es-ES', { month: 'long' });
    await ctx.reply(`📅 TOTALES DEL MES DE ${month.toUpperCase()}:\n\n${message}\n\nTotal: $${this.formatMoney(total)}`);
  }

  @Command('cancelado')
  async onCancelado(@Ctx() ctx: Context) {
    if (!this.isAuthorized(ctx)) return ctx.reply('No autorizado.');

    await this.expensesService.clearAll();
    await ctx.reply('⚠️ Todos los gastos han sido borrados.');
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    await ctx.reply(
      'No entiendo ese comando o mensaje. 😅\n\n' +
      'Usa /start para ver los comandos disponibles.'
    );
  }
}
