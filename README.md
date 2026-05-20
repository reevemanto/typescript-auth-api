# TypeScript Authentication API

**Version:** 1.0.0

## Live API
[https://typescript-auth-api.onrender.com](https://typescript-auth-api.onrender.com)

## API Documentation
[https://typescript-auth-api.onrender.com/api-docs](https://typescript-auth-api.onrender.com/api-docs)

## Setup Instructions

### Development
1. Clone the repository
2. Run `npm install`
3. Create a `config.json` file in the root directory
4. Run `npm run start:dev`

### Production Build
1. Run `npm run build`
2. Run `npm start`

### Available Scripts
| Script | Description |
|--------|-------------|
| `npm run start:dev` | Development with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |

## Deployment (Render)

| Setting | Value |
|---------|-------|
| Build Command | `npm ci --include-dev && npm run build` |
| Start Command | `node dist/server.js` |

## Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL database host |
| `DB_PORT` | MySQL database port |
| `DB_USER` | MySQL database user |
| `DB_PASSWORD` | MySQL database password |
| `DB_NAME` | MySQL database name |
| `JWT_SECRET` | Secret key for JWT signing |
| `CORS_ORIGIN` | Frontend URL |
| `COOKIE_SECURE` | Set to `true` for production |
| `COOKIE_SAMESITE` | Set to `none` for cross-domain |
| `RESEND_API_KEY` | Resend API key for emails |
| `EMAIL_FROM` | Sender email address |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/accounts/authenticate` | Login |
| POST | `/accounts/refresh-token` | Refresh JWT token |
| POST | `/accounts/revoke-token` | Logout |
| POST | `/accounts/register` | Register new account |
| POST | `/accounts/verify-email` | Verify email |
| POST | `/accounts/forgot-password` | Forgot password |
| POST | `/accounts/reset-password` | Reset password |
| GET | `/accounts` | Get all accounts (Admin only) |
| GET | `/accounts/:id` | Get account by ID |
| POST | `/accounts` | Create account (Admin only) |
| PUT | `/accounts/:id` | Update account |
| DELETE | `/accounts/:id` | Delete account |

## Features
- JWT authentication with refresh tokens
- Email verification via Resend
- Password reset functionality
- Role-based access control (Admin/User)
- MySQL database

## Tech Stack
- Node.js
- TypeScript
- Express
- MySQL 
- JWT
- Resend 