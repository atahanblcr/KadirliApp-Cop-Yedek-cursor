# Kadirli Backend API

Backend API for Kadirli App built with Node.js, Express, TypeScript, and PostgreSQL (Prisma ORM).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Prisma schema definition
├── src/
│   ├── controllers/           # Request handlers
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic
│   ├── middleware/            # Custom middleware
│   ├── types/                 # TypeScript type definitions
│   ├── lib/                   # Utilities (Prisma client, etc.)
│   └── server.ts              # Express app entry point
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

The Prisma schema includes the following main entities:

- **User** - User accounts and profiles
- **Ad** - Marketplace classifieds
- **GuideCategory** & **GuideItem** - City guide with categories
- **TaxiRequest** - Taxi booking system
- **TransportRoute**, **TransportStop**, **RouteStop** - Public transport
- **IntercityTrip** - Intercity transportation
- **Pharmacy** - Duty pharmacy information
- **DeathNotice** - Death announcements
- **Announcement** - City announcements
- **Event** - City events
- **Campaign** - Business campaigns
- **Place** - Points of interest

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kadirli_db?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

## 📚 API Documentation

API endpoints will be documented here as they are implemented.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL

