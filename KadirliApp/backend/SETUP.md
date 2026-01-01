# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ PostgreSQL v14+ installed and running
- ✅ A PostgreSQL database created (e.g., `kadirli_db`)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/kadirli_db?schema=public"
PORT=3000
NODE_ENV=development
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `kadirli_db` with your database name (create it first if it doesn't exist)

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

This creates the Prisma Client based on your schema.

### 4. Create Database Tables

```bash
npm run prisma:migrate
```

This will:
- Create a new migration
- Apply it to your database
- Create all tables, enums, indexes, and relationships

When prompted, name your migration (e.g., `init`).

### 5. (Optional) Open Prisma Studio

To visually inspect your database:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit data.

### 6. Start the Development Server

```bash
npm run dev
```

The server should start on `http://localhost:3000` (or your configured PORT).

### 7. Test the Health Endpoint

Open your browser or use curl:

```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Kadirli Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## ✅ Verification Checklist

- [ ] Dependencies installed (`node_modules` exists)
- [ ] `.env` file created and configured
- [ ] Prisma Client generated (`node_modules/.prisma/client` exists)
- [ ] Database migration completed (tables exist in PostgreSQL)
- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
Run `npm run prisma:generate` again.

### "Error: P1001: Can't reach database server"
- Check PostgreSQL is running: `pg_isready` or check service status
- Verify `DATABASE_URL` in `.env` is correct
- Check firewall/network settings

### "Error: P1003: Database does not exist"
Create the database first:
```sql
CREATE DATABASE kadirli_db;
```

### Migration errors
If migrations fail, you can reset (⚠️ **WARNING**: This deletes all data):
```bash
npx prisma migrate reset
```

## 📚 Next Steps

Once setup is complete:
1. Review the schema in `prisma/schema.prisma`
2. Check `SCHEMA_SUMMARY.md` for entity relationships
3. Review `FOLDER_STRUCTURE.md` for project organization
4. Start implementing controllers and routes (module by module)

