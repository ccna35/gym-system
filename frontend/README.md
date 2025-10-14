# Gym Management System - Frontend

A modern, production-ready React + TypeScript frontend for managing gym operations including members, plans, memberships, and payments.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management (auth)
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 🎯 Features

### ✅ Implemented

- **Authentication** - Login/Register with JWT, protected routes, persistent auth state
- **Members Management** - Full CRUD with search, filtering, and validation
- **Plans Management** - Create/Edit/Delete membership plans
- **Dashboard** - Real-time statistics and overview
- **Responsive Design** - Mobile-first, fully responsive
- **Form Validation** - React Hook Form + Zod schemas
- **Loading States** - Smooth UX with loading indicators
- **Toast Notifications** - User feedback system

## 🛠️ Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Environment Setup

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── pages/           # Page components
├── services/        # API service layer
├── store/           # Zustand state management
└── types/           # TypeScript definitions
```

## 📚 Best Practices Implemented

1. **Separation of Concerns** - Services, hooks, and components
2. **Type Safety** - Full TypeScript coverage
3. **Performance** - React Query caching and optimization
4. **Security** - JWT handling, protected routes
5. **UX** - Loading states, error handling, toast notifications

---

Built with ❤️ using React, TypeScript, and TailwindCSS
