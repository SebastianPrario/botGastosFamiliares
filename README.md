# Asistente de Gastos Familiares 🤖💸

Un bot de Telegram desarrollado con **NestJS** para gestionar y llevar un control de los gastos compartidos en el hogar de forma sencilla y eficiente.

## 🚀 Características

- **Registro de Gastos:** `/gasto` o `/g [categoría] [monto]` permite registrar rápidamente cualquier gasto realizado.
- **Control de Totales:** `/total` muestra cuánto lleva gastado cada integrante y la diferencia a compensar.
- **Resumen Mensual:** `/resumen` agrupa los gastos del mes actual por categorías.
- **Historial Reciente:** `/ultimos` muestra los últimos 10 movimientos registrados.
- **Gestión de Ciclos:** `/cancelado` permite marcar los gastos como liquidados y `/borrar` limpia el historial.
- **Seguridad:** Sistema de autorización por ID de usuario de Telegram.
- **Dockerizado:** Listo para desplegar con Docker y Docker Compose.

## 🛠️ Tecnologías

- [NestJS](https://nestjs.com/) - Framework Node.js progresivo.
- [Telegraf](https://telegraf.js.org/) - Biblioteca para bots de Telegram.
- [TypeORM](https://typeorm.io/) - ORM para TypeScript y JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional robusta.
- [Docker](https://www.docker.com/) - Para despliegue en contenedores.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/)
- Un token de bot proporcionado por [@BotFather](https://t.me/botfather).
- Una base de datos PostgreSQL.

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto basado en el siguiente esquema:

```env
TELEGRAM_BOT_TOKEN=tu_token_de_telegram
DATABASE_URL=postgres://usuario:password@localhost:5432/db_name
AUTHORIZED_USERS=ID1,ID2,ID3
NODE_ENV=development
# Opcional para producción (Webhooks)
# WEBHOOK_DOMAIN=https://tu-dominio.com
```

> **Nota:** Puedes obtener tu ID de usuario de Telegram usando bots como `@userinfobot`.

## 🚀 Instalación y Ejecución

### Desarrollo Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run start:dev
   ```

### Con Docker 🐳

Para levantar todo el entorno (App + Base de datos) de forma rápida:

```bash
docker-compose up -d
```

## 🤖 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `/start` | Inicia el bot y muestra el mensaje de bienvenida. |
| `/gasto` o `/g [cat] [monto]` | Registra un nuevo gasto (ej: `/gasto Super 1500`). |
| `/total` | Muestra el acumulado por cada integrante y la diferencia. |
| `/resumen` | Totales del mes en curso agrupados por categoría. |
| `/ultimos` | Lista los últimos 10 gastos registrados. |
| `/cancelado` | Marca todos los gastos como liquidados. |
| `/borrar` | Elimina permanentemente todos los registros. |
| `/help` | Muestra la ayuda y lista de comandos. |

## 📄 Licencia

Este proyecto es de uso privado y educativo.
