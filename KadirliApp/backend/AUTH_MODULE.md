# Authentication Module Documentation

## Overview

The authentication module implements phone-based OTP (One-Time Password) authentication with JWT tokens, matching the iOS app's authentication flow.

## Architecture

```
Routes → Controllers → Services → Prisma/Database
```

### Components

1. **Routes** (`src/routes/auth.routes.ts`, `profile.routes.ts`)
   - Define API endpoints
   - Apply middleware (authentication)

2. **Controllers** (`src/controllers/auth.controller.ts`, `profile.controller.ts`)
   - Handle HTTP requests/responses
   - Validate input
   - Call services

3. **Services** (`src/services/auth.service.ts`, `otp.service.ts`, `jwt.service.ts`, `profile.service.ts`)
   - Business logic
   - Database operations
   - OTP generation/verification
   - JWT token management

4. **Middleware** (`src/middleware/auth.middleware.ts`)
   - JWT token verification
   - User context attachment

## API Endpoints

### 1. Send OTP

**POST** `/api/auth/otp`

Request body:
```json
{
  "phone": "+905551234567"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Note:** The OTP code is logged to the console for development. In production, integrate with an SMS service.

### 2. Verify OTP

**POST** `/api/auth/verify`

Request body:
```json
{
  "phone": "+905551234567",
  "token": "123456"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": null,
      "phone": "+905551234567",
      "fullName": null,
      "neighborhood": null,
      "app_metadata": null,
      "user_metadata": null
    }
  }
}
```

**Behavior:**
- If OTP is valid, creates a new user (if doesn't exist) or returns existing user
- Returns JWT token for subsequent authenticated requests
- OTP expires after 10 minutes

### 3. Update Profile

**PATCH** `/api/profiles`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

Request body:
```json
{
  "fullName": "John Doe",
  "neighborhood": "Merkez"
}
```

Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": null,
    "phone": "+905551234567",
    "fullName": "John Doe",
    "neighborhood": "Merkez"
  }
}
```

### 4. Get Profile

**GET** `/api/profiles`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": null,
    "phone": "+905551234567",
    "fullName": "John Doe",
    "neighborhood": "Merkez",
    "notificationPreferences": {
      "news": true,
      "deaths": true,
      "pharmacy": false,
      "events": true
    }
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "ErrorName",
  "message": "Human-readable error message"
}
```

Common status codes:
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/expired token, invalid OTP)
- `404` - Not Found (resource doesn't exist)
- `422` - Validation Error
- `500` - Internal Server Error

## Security Features

1. **JWT Tokens**
   - Signed with secret key
   - Configurable expiration (default: 7 days)
   - Stored in `Authorization: Bearer <token>` header

2. **OTP Security**
   - 6-digit random codes
   - 10-minute expiration
   - Single-use (deleted after verification)
   - In-memory storage (for development)

3. **Input Validation**
   - Phone number format validation
   - Required field checks
   - Type validation

## Development Notes

### OTP Storage

Currently, OTPs are stored in-memory (Map). For production:
- Use Redis for distributed systems
- Or store in database with expiry timestamps
- Implement rate limiting

### SMS Integration

To send real SMS:
1. Choose a provider (Twilio, AWS SNS, etc.)
2. Update `otp.service.ts` `sendOTP()` method
3. Add provider credentials to `.env`

### JWT Secret

**CRITICAL:** Change `JWT_SECRET` in production to a strong random string:
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Testing

### Using cURL

1. Send OTP:
```bash
curl -X POST http://localhost:3000/api/auth/otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+905551234567"}'
```

2. Verify OTP (check console for code):
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+905551234567", "token": "123456"}'
```

3. Update Profile:
```bash
curl -X PATCH http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"fullName": "John Doe", "neighborhood": "Merkez"}'
```

## Next Steps

- [ ] Add rate limiting for OTP requests
- [ ] Integrate SMS service for production
- [ ] Add refresh token mechanism
- [ ] Implement password reset flow (if needed)
- [ ] Add email verification (optional)

