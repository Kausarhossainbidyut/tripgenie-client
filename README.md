# React + TypeScript Starter Template

A production-ready, zero-setup React starter template with TypeScript. Clone, install, and start building immediately.

## Features

- React 18 + TypeScript
- React Router (routing with protected routes)
- Authentication system (login/register/logout)
- Responsive design (mobile, tablet, desktop)
- Dashboard with sidebar navigation
- Reusable UI components (Button, Input)
- Zero external CSS dependencies

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd react-vite-starter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── layout/          # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── context/
│   └── AuthContext.tsx  # Authentication state
├── hooks/
│   ├── useAuth.ts
│   └── useFetch.ts
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── routes/
│   └── index.tsx        # Route configuration
├── services/
│   └── api.ts           # API service layer
├── types/
│   └── index.ts         # TypeScript types
├── constants/
│   └── index.ts         # App constants
├── App.tsx
├── main.tsx
└── index.css            # Global styles
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run dev` | Start development server (alias) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Authentication

The template includes a complete authentication system:

- **Login**: `/login`
- **Register**: `/register`
- **Dashboard**: `/dashboard` (protected route)

Authentication state is stored in localStorage. Replace the mock authentication in `src/context/AuthContext.tsx` with your real API calls.

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: >= 1024px

## Customization

### Change App Name

Edit `src/constants/index.ts`:

```typescript
export const APP_NAME = 'Your App Name';
```

### Change API URL

Edit `src/constants/index.ts`:

```typescript
export const API_URL = 'https://your-api.com/api';
```

### Add New Routes

Edit `src/routes/index.tsx`:

```typescript
<Route path="/new-page" element={<NewPage />} />
```

### Add New Sidebar Menu Item

Edit `src/pages/Dashboard.tsx`:

```typescript
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'new-item', label: 'New Item', icon: '🆕' }, // Add here
];
```

## UI Components

### Button

```tsx
import { Button } from './components/ui/Button';

// Variants
<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Loading</Button>
```

### Input

```tsx
import { Input } from './components/ui/Input';

<Input label="Email" type="email" placeholder="Enter email" />
<Input label="Password" type="password" error="Error message" />
```

## Using the useAuth Hook

```tsx
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication methods
}
```

## Using the useFetch Hook

```tsx
import { useFetch } from './hooks/useFetch';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch({
    url: 'https://api.example.com/data'
  });
  
  // Handle loading, error, and data states
}
```

## License

MIT
