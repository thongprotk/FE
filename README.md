# FlashAI - Frontend Application

React + TypeScript + Vite frontend for the FlashAI flashcard learning platform, fully integrated with the NestJS backend API.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:3000`

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── components/          # UI components (shadcn/ui)
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom hooks
├── layouts/            # Layout components
├── lib/                # Utility libraries
│   ├── api-client.ts  # Axios instance
│   └── utils.ts       # Helper functions
├── pages/              # Page components
│   ├── HomePage/      # Landing with nav
│   ├── LoginPage/     # Auth forms
│   ├── DecksPage/     # Deck management
│   ├── HeatmapPage/   # Analytics & stats
│   ├── ReviewMode/    # Card review
│   └── ...
├── services/           # API service layer
│   ├── auth.service.ts
│   ├── deck.service.ts
│   ├── card.service.ts
│   ├── analytics.service.ts
│   └── resource.service.ts
├── types/              # TypeScript definitions
│   └── api.ts         # API response types
└── routes/             # React Router config
```

## 🔌 Backend Integration

### API Client (`src/lib/api-client.ts`)

Axios instance with:

- Automatic JWT token injection
- Error handling with toast notifications
- 401 auto-logout and redirect

### Services (`src/services/`)

All backend endpoints wrapped in typed service functions:

```typescript
// Example: Login
import { authService } from "@/services/auth.service";

const result = await authService.login({
  username: "user@example.com",
  password: "password123",
});
```

Available services:

- **authService** - Login, register, profile, Google OAuth
- **deckService** - CRUD for decks
- **cardService** - CRUD + review for cards
- **analyticsService** - Stats, activity, heatmap
- **resourceService** - HTML parsing, flashcard generation

### Authentication

Auth managed through React Context:

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <div>Welcome, {user?.firstName}!</div>;
}
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS:

- Card, Button, Input, Dialog, Toast
- Tabs, Progress, Accordion, etc.
- Dark/light theme support

## 📄 Pages

### `/` - Home

Navigation hub with feature cards

### `/login` - Authentication

Login and registration forms

### `/decks` - Deck Management (Auth Required)

- List user's decks
- Create new decks
- View deck cards
- Card statistics

### `/heatmap` - Analytics (Auth Required)

- Learning overview stats
- Activity heatmap (365 days)
- Recent activity timeline

### `/review` - Review Mode

Interactive flashcard review (demo with mock data)

### `/landing` - Marketing Page

Feature showcase and call-to-action

### `/extension` - Chrome Extension UI

Popup interface for browser extension

## 🔧 Configuration

### Vite Config (`vite.config.ts`)

Includes proxy for backend API:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:3000/api`)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)

## 🛠️ Development

### Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Adding New Features

1. **Create service** in `src/services/`
2. **Define types** in `src/types/api.ts`
3. **Create page/component** using service
4. **Add route** in `src/routes/index.tsx`

Example service:

```typescript
import apiClient from "@/lib/api-client";

export const myService = {
  async getData(): Promise<MyType> {
    const response = await apiClient.get<MyType>("/endpoint");
    return response.data;
  },
};
```

## 🔐 Authentication Flow

1. User enters credentials on `/login`
2. `authService.login()` calls `/api/auth/login`
3. JWT token stored in localStorage
4. Token auto-injected in subsequent requests
5. `authService.getProfile()` fetches user data
6. `AuthContext` updates with user info
7. Protected routes check `isAuthenticated`

## 📊 API Integration Status

- ✅ Authentication (login/register/profile)
- ✅ Deck management (CRUD operations)
- ✅ Card management (CRUD + review)
- ✅ Analytics (overview + heatmap)
- ✅ Resource parsing (HTML to flashcards)
- ⚠️ Google OAuth (requires client ID setup)
- ⚠️ Review mode (needs API integration)

## 🐛 Troubleshooting

### Network Errors

- Ensure backend is running on port 3000
- Check proxy config in `vite.config.ts`

### 401 Unauthorized

- Token expired - logout and login again
- Clear localStorage and retry

### CORS Issues

- Set `CORS_ORIGIN=http://localhost:5173` in backend
- Restart backend after env changes

### Build Errors

- Clear node_modules and reinstall
- Check TypeScript errors: `npx tsc --noEmit`

## 📚 Documentation

- **[INTEGRATION.md](./INTEGRATION.md)** - Complete integration guide
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Setup summary

## 🎯 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 📝 Notes

- Token stored in localStorage (not httpOnly cookie)
- All API calls use try-catch with toast notifications
- Protected routes check auth before rendering
- Proxy handles `/api/*` requests in development
- Production build requires proper CORS configuration

---

Built with ❤️ using React + TypeScript + Vite
