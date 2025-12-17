# Frontend-Backend Integration Guide

## Overview

This guide explains how the React/Vite frontend is integrated with the NestJS backend API.

## Setup Instructions

### 1. Backend Setup (NestJS)

```bash
cd nestjs-app
npm install
```

Create `.env` file in `nestjs-app/` with required variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=flashcard_db
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APM_WEBHOOK_URL=your_webhook_url
```

Start local infrastructure (Postgres + Redis):

```bash
docker-compose up -d
```

Run migrations:

```bash
npm run typeorm:migration:run
```

Start backend dev server:

```bash
npm run start:dev
```

Backend will run on `http://localhost:3000` with API at `http://localhost:3000/api`

### 2. Frontend Setup (React/Vite)

```bash
cd fe/FE
npm install
```

Create `.env` file in `fe/FE/`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start frontend dev server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Architecture

### API Client (`src/lib/api-client.ts`)

- Axios instance with base URL from environment
- Request interceptor: adds JWT token to Authorization header
- Response interceptor: handles errors and 401 redirects
- Automatically stores/removes tokens from localStorage

### Services

All API services are in `src/services/`:

#### Auth Service (`auth.service.ts`)

- `register()` - Create new user
- `login()` - Login with username/password
- `getProfile()` - Get current user info
- `logout()` - Clear auth tokens
- `isAuthenticated()` - Check auth status
- `getGoogleAuthUrl()` - Get Google OAuth URL
- `handleGoogleCallback()` - Process Google OAuth callback

#### Deck Service (`deck.service.ts`)

- `getAll()` - Get user's decks (paginated)
- `getPublic()` - Get public decks (no auth)
- `getById()` - Get single deck
- `create()` - Create new deck
- `update()` - Update deck
- `delete()` - Delete deck
- `getDueCards()` - Get count of due cards

#### Card Service (`card.service.ts`)

- `getAll()` - Get all cards in deck (paginated)
- `getById()` - Get single card
- `create()` - Create new card
- `update()` - Update card
- `delete()` - Delete card
- `review()` - Review card with SM-2 algorithm (quality 0-5)
- `getDueCards()` - Get cards due for review
- `resetSchedule()` - Reset card to NEW status
- `bulkCreate()` - Create multiple cards at once

#### Analytics Service (`analytics.service.ts`)

- `getOverview()` - Get learning overview (total/due/mastered cards, etc.)
- `getActivity()` - Get daily activity history
- `getHeatmap()` - Get activity heatmap data for visualization
- `getDeckStats()` - Get statistics for specific deck
- `refreshActivity()` - Trigger cache refresh

#### Resource Service (`resource.service.ts`)

- `getAll()` - Get all resources
- `getById()` - Get single resource
- `create()` - Create resource (parses HTML content)
- `delete()` - Delete resource
- `generateFlashcards()` - AI-generate flashcards from resource

### Authentication Context (`src/contexts/AuthContext.tsx`)

React Context that manages authentication state:

- `user` - Current user object
- `loading` - Auth loading state
- `isAuthenticated` - Boolean auth status
- `login()` - Login function
- `register()` - Register function
- `logout()` - Logout function
- `refreshProfile()` - Refresh user profile from API

Usage:

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user?.firstName}!</div>;
}
```

### Types (`src/types/api.ts`)

TypeScript types matching backend DTOs:

- `User`, `AuthResponse`, `LoginRequest`, `RegisterRequest`
- `Deck`, `CreateDeckDto`, `UpdateDeckDto`
- `Card`, `CardStatus`, `CreateCardDto`, `UpdateCardDto`, `ReviewCardDto`
- `LearningOverview`, `DailyActivity`, `ActivityHeatmap`
- `Resource`, `CreateResourceDto`
- `ApiError`, `ApiResponse`, `PaginatedResponse`

## Pages with API Integration

### LoginPage (`src/pages/LoginPage/`)

- Login/register forms
- Uses `authService` and `useAuth` hook
- Redirects to home after successful auth

### DecksPage (`src/pages/DecksPage/`)

- Lists user's decks
- Shows cards in selected deck
- Create new deck button
- Uses `deckService` and `cardService`

### HeatmapPage (`src/pages/HeatmapPage/`)

- Real-time learning statistics
- Activity heatmap visualization
- Uses `analyticsService.getOverview()` and `analyticsService.getHeatmap()`

## Proxy Configuration

Vite dev server proxies `/api` requests to backend (see `vite.config.ts`):

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

This allows the frontend to make requests to `/api/*` which are forwarded to `http://localhost:3000/api/*`

## CORS Configuration

Backend must allow frontend origin in `CORS_ORIGIN` env variable:

```env
CORS_ORIGIN=http://localhost:5173
```

## Error Handling

All API calls should use try-catch with toast notifications:

```tsx
import { toast } from "sonner";

try {
  const decks = await deckService.getAll();
  setDecks(decks.items);
} catch (error: any) {
  toast.error(error.message || "Failed to load decks");
}
```

The `Toaster` component is added to `MainLayout` to show notifications.

## Protected Routes

Pages requiring authentication should check `isAuthenticated`:

```tsx
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <div>Please login to view this page</div>;
}
```

## API Endpoints Reference

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user (requires auth)
- `GET /api/auth/google/callback?code=...` - Google OAuth callback

### Decks

- `GET /api/decks` - Get user's decks (requires auth)
- `GET /api/decks/public` - Get public decks (no auth)
- `GET /api/decks/:id` - Get single deck (requires auth)
- `POST /api/decks` - Create deck (requires auth)
- `PATCH /api/decks/:id` - Update deck (requires auth)
- `DELETE /api/decks/:id` - Delete deck (requires auth)

### Cards

- `GET /api/decks/:deckId/cards` - Get cards (requires auth)
- `GET /api/decks/:deckId/cards/:id` - Get single card (requires auth)
- `POST /api/decks/:deckId/cards` - Create card (requires auth)
- `PATCH /api/decks/:deckId/cards/:id` - Update card (requires auth)
- `DELETE /api/decks/:deckId/cards/:id` - Delete card (requires auth)
- `POST /api/decks/:deckId/cards/:id/review` - Review card (requires auth)
- `POST /api/decks/:deckId/cards/:id/reset` - Reset card schedule (requires auth)
- `GET /api/decks/:deckId/cards/due` - Get due cards (requires auth)

### Analytics

- `GET /api/analytics/overview` - Get learning overview (requires auth)
- `GET /api/analytics/activity?days=365` - Get activity history (requires auth)
- `GET /api/analytics/heatmap?days=365` - Get heatmap data (requires auth)
- `GET /api/analytics/decks/:id` - Get deck statistics (requires auth)

### Resources

- `GET /api/resources` - Get all resources (requires auth)
- `GET /api/resources/:id` - Get single resource (requires auth)
- `POST /api/resources` - Create resource (requires auth)
- `DELETE /api/resources/:id` - Delete resource (requires auth)
- `POST /api/resources/:id/generate-flashcards` - Generate flashcards from resource (requires auth)

## Testing the Integration

1. Start backend: `cd nestjs-app && npm run start:dev`
2. Start frontend: `cd fe/FE && npm run dev`
3. Open `http://localhost:5173`
4. Register a new account at `/login`
5. Navigate to `/decks` to see your decks
6. Navigate to `/heatmap` to see analytics
7. Check browser DevTools Network tab to see API calls

## Troubleshooting

### CORS Errors

- Ensure `CORS_ORIGIN=http://localhost:5173` in backend `.env`
- Restart backend after changing env variables

### 401 Unauthorized

- Token might be expired or invalid
- Try logging out and logging back in
- Check localStorage for `accessToken`

### Network Errors

- Ensure backend is running on port 3000
- Ensure frontend is running on port 5173
- Check that proxy is configured in `vite.config.ts`

### Database Connection Issues

- Ensure Docker containers are running: `docker-compose ps`
- Check database credentials in backend `.env`

## Next Steps

To add more features:

1. Create new service in `src/services/`
2. Define TypeScript types in `src/types/api.ts`
3. Create UI components/pages that use the service
4. Add routes in `src/routes/index.tsx`
5. Test with backend API

Example service pattern:

```typescript
import apiClient from "@/lib/api-client";

export const myService = {
  async getData(): Promise<MyType> {
    const response = await apiClient.get<MyType>("/my-endpoint");
    return response.data;
  },
};
```
