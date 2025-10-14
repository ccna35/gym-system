# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:5000`
- Git (optional)

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# The default configuration should work:
# VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## First Time Setup

### Backend Requirements

Make sure your backend is running:

```bash
cd ../backend
npm run dev
```

Backend should be at: **http://localhost:5000**

### Test Credentials

**For Testing:** Use these values when registering/logging in:

- Tenant ID: `1` (default tenant)
- Role ID: `2` (regular user) or `1` (admin)

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Quick Tour

### 1. **Login/Register**

- Navigate to `/login` or `/register`
- Create an account or use existing credentials
- JWT token is automatically stored

### 2. **Dashboard**

- View statistics and overview
- See recent members and plans
- Navigate using the sidebar

### 3. **Members Management**

- Click "Members" in sidebar
- Add new member with the "Add Member" button
- Search members by name, email, or phone
- Edit or delete existing members

### 4. **Plans Management**

- Click "Plans" in sidebar
- Create membership plans
- Set duration and pricing
- Edit or delete plans

## Common Issues

### Port Already in Use

```bash
# Change port in vite.config.ts or kill process using port 5173
npx kill-port 5173
```

### API Connection Error

- Check backend is running on port 5000
- Verify `.env` file has correct `VITE_API_URL`
- Check CORS settings in backend

### TypeScript Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities (axios, validation, etc.)
├── pages/         # Page components
├── services/      # API service layer
├── store/         # State management (Zustand)
└── types/         # TypeScript definitions
```

## Key Features

✅ **Authentication** - Login/Register with JWT
✅ **Protected Routes** - Automatic redirects
✅ **Form Validation** - Real-time error messages
✅ **Toast Notifications** - User feedback
✅ **Responsive Design** - Mobile-friendly
✅ **Search & Filter** - Easy data management
✅ **Loading States** - Better UX

## Next Steps

1. Explore the codebase in `src/`
2. Check `IMPLEMENTATION_SUMMARY.md` for details
3. Read `README.md` for full documentation
4. Customize theme in `tailwind.config.js`
5. Add new features following existing patterns

## Need Help?

- Check `README.md` for detailed docs
- Review `IMPLEMENTATION_SUMMARY.md` for architecture
- Look at existing components for patterns
- TypeScript will guide you with type errors

## Production Build

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm run preview

# Deploy the `dist/` folder to your hosting
```

---

**Happy Coding! 🎉**
