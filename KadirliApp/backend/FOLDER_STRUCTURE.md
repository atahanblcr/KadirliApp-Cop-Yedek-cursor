# Backend Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema with all models, enums, and relationships
│   └── migrations/            # Auto-generated migration files (after running migrations)
│
├── src/
│   ├── controllers/           # Request handlers (business logic entry points)
│   │   ├── auth.controller.ts
│   │   ├── ads.controller.ts
│   │   ├── announcements.controller.ts
│   │   ├── campaigns.controller.ts
│   │   ├── deaths.controller.ts
│   │   ├── events.controller.ts
│   │   ├── guide.controller.ts
│   │   ├── pharmacy.controller.ts
│   │   ├── places.controller.ts
│   │   ├── taxi.controller.ts
│   │   ├── transport.controller.ts
│   │   └── index.ts
│   │
│   ├── routes/                 # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── ads.routes.ts
│   │   ├── announcements.routes.ts
│   │   ├── campaigns.routes.ts
│   │   ├── deaths.routes.ts
│   │   ├── events.routes.ts
│   │   ├── guide.routes.ts
│   │   ├── pharmacy.routes.ts
│   │   ├── places.routes.ts
│   │   ├── taxi.routes.ts
│   │   ├── transport.routes.ts
│   │   └── index.ts
│   │
│   ├── services/               # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── ads.service.ts
│   │   ├── announcements.service.ts
│   │   ├── campaigns.service.ts
│   │   ├── deaths.service.ts
│   │   ├── events.service.ts
│   │   ├── guide.service.ts
│   │   ├── pharmacy.service.ts
│   │   ├── places.service.ts
│   │   ├── taxi.service.ts
│   │   └── transport.service.ts
│   │
│   ├── middleware/             # Custom Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── lib/                    # Utilities and shared code
│   │   └── prisma.ts           # Prisma Client instance
│   │
│   └── server.ts               # Express app entry point
│
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── FOLDER_STRUCTURE.md         # This file
```

## Architecture Overview

### Controllers
- Handle HTTP requests and responses
- Validate input
- Call services for business logic
- Return formatted responses

### Services
- Contain business logic
- Interact with Prisma Client
- Handle data transformations
- Can be reused across controllers

### Routes
- Define API endpoints
- Map HTTP methods to controller methods
- Apply middleware (auth, validation, etc.)

### Middleware
- Authentication/Authorization
- Request validation
- Error handling
- Logging

### Types
- Shared TypeScript interfaces and types
- API response types
- Request/Response DTOs

