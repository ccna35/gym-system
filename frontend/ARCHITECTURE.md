# Application Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND APPLICATION                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │    Pages     │◄─────┤   Routing    │                    │
│  │  (Views)     │      │ React Router │                    │
│  └──────┬───────┘      └──────────────┘                    │
│         │                                                    │
│         │ uses                                               │
│         ▼                                                    │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Hooks      │◄─────┤    Store     │                    │
│  │ (Business)   │      │   Zustand    │                    │
│  └──────┬───────┘      └──────────────┘                    │
│         │                                                    │
│         │ calls                                              │
│         ▼                                                    │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  Services    │◄─────┤ React Query  │                    │
│  │  (API)       │      │  (Cache)     │                    │
│  └──────┬───────┘      └──────────────┘                    │
│         │                                                    │
│         │ HTTP                                               │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │    Axios     │                                           │
│  │ (HTTP Client)│                                           │
│  └──────┬───────┘                                           │
└─────────┼─────────────────────────────────────────────────┘
          │
          │ HTTPS/REST API
          │
┌─────────▼─────────────────────────────────────────────────┐
│                     BACKEND API                             │
│                  (Express + MySQL)                          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Submit credentials
     ▼
┌──────────────┐
│  LoginPage   │
└──────┬───────┘
       │ 2. Call useLogin hook
       ▼
┌──────────────┐
│  useAuth.ts  │
└──────┬───────┘
       │ 3. Call auth.service
       ▼
┌──────────────┐
│auth.service  │
└──────┬───────┘
       │ 4. HTTP POST /auth/login
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 5. Return JWT token
       ▼
┌──────────────┐
│  authStore   │ ← Store token & user
└──────┬───────┘
       │ 6. Redirect
       ▼
┌──────────────┐
│  Dashboard   │
└──────────────┘
```

### CRUD Operation Flow (Members Example)

```
┌──────────────┐
│ MembersPage  │
└──────┬───────┘
       │ 1. Click "Add Member"
       ▼
┌──────────────┐
│ MemberModal  │
└──────┬───────┘
       │ 2. Fill form & submit
       ▼
┌──────────────┐
│React Hook    │ ← Validates with Zod
│   Form       │
└──────┬───────┘
       │ 3. Call useCreateMember
       ▼
┌──────────────┐
│useMembers.ts │
└──────┬───────┘
       │ 4. Mutate via React Query
       ▼
┌──────────────┐
│member.service│
└──────┬───────┘
       │ 5. POST /api/members
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 6. Success response
       ▼
┌──────────────┐
│React Query   │ ← Invalidates cache
└──────┬───────┘
       │ 7. Refetch data
       ▼
┌──────────────┐
│ MembersPage  │ ← Updated list
└──────────────┘
       │
       ▼
┌──────────────┐
│Toast Notify  │ ← "Member created!"
└──────────────┘
```

## 🎯 Component Hierarchy

```
App.tsx
│
├─ QueryClientProvider
│  │
│  ├─ BrowserRouter
│     │
│     ├─ Public Routes
│     │  ├─ LoginPage
│     │  └─ RegisterPage
│     │
│     └─ Protected Routes (ProtectedRoute wrapper)
│        │
│        └─ DashboardLayout
│           │
│           ├─ Sidebar Navigation
│           ├─ Header
│           │
│           └─ Main Content (Outlet)
│              │
│              ├─ DashboardPage
│              │
│              ├─ MembersPage
│              │  └─ MemberModal
│              │
│              ├─ PlansPage
│              │  └─ PlanModal
│              │
│              ├─ MembershipsPage
│              │
│              └─ PaymentsPage
│
└─ ReactQueryDevtools
```

## 📊 State Management Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    STATE LAYERS                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  SERVER STATE (React Query)                    │    │
│  │  • Members data                                 │    │
│  │  • Plans data                                   │    │
│  │  • Memberships data                             │    │
│  │  • Payments data                                │    │
│  │  • Automatic caching (5 min)                    │    │
│  │  • Background refetching                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  CLIENT STATE (Zustand)                        │    │
│  │  • User info                                    │    │
│  │  • JWT token                                    │    │
│  │  • isAuthenticated                              │    │
│  │  • Persisted to localStorage                    │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  FORM STATE (React Hook Form)                  │    │
│  │  • Form field values                            │    │
│  │  • Validation errors                            │    │
│  │  • Dirty/touched states                         │    │
│  │  • Submission status                            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔒 Authentication Flow Detail

```
┌────────────┐
│   Guest    │
└─────┬──────┘
      │
      ├─ Navigate to /dashboard
      │
      ▼
┌──────────────────┐
│ ProtectedRoute   │
└──────┬───────────┘
       │
       │ Check: isAuthenticated?
       │
       ├─ NO → Redirect to /login
       │
       └─ YES → Allow access
              │
              ▼
         ┌──────────────┐
         │ DashboardLayout│
         └──────┬─────────┘
                │
                │ Axios interceptor adds:
                │ Authorization: Bearer <token>
                │
                ▼
         ┌──────────────┐
         │  API Calls   │
         └──────┬───────┘
                │
                │ If 401 error:
                │ • Logout user
                │ • Redirect to /login
                │
                └─ Continue...
```

## 🎨 Form Validation Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Types in form
       ▼
┌───────────────────┐
│ React Hook Form   │
└──────┬────────────┘
       │ On change
       ▼
┌───────────────────┐
│  Zod Schema       │ ← memberSchema
└──────┬────────────┘
       │ Validates
       │
       ├─ Valid → Continue
       │
       └─ Invalid → Show errors
                    │
                    ▼
             ┌──────────────┐
             │ Error Message│
             └──────────────┘
```

## 📱 Responsive Behavior

```
┌─────────────────────────────────────────────┐
│              SCREEN SIZES                    │
├─────────────────────────────────────────────┤
│                                              │
│  Mobile (< 640px)                            │
│  • Sidebar: Overlay (hidden by default)     │
│  • Tables: Horizontal scroll                 │
│  • Cards: Single column                      │
│                                              │
│  Tablet (640px - 1024px)                     │
│  • Sidebar: Collapsible                      │
│  • Tables: Responsive layout                 │
│  • Cards: 2 columns                          │
│                                              │
│  Desktop (> 1024px)                          │
│  • Sidebar: Always visible                   │
│  • Tables: Full layout                       │
│  • Cards: 3+ columns                         │
│                                              │
└─────────────────────────────────────────────┘
```

## 🚀 API Request Cycle

```
Component
   │
   │ 1. Call hook (e.g., useMembers)
   ▼
React Query
   │
   │ 2. Check cache
   │
   ├─ Cache HIT → Return cached data
   │
   └─ Cache MISS/Stale
      │
      │ 3. Call service
      ▼
   Service Layer
      │
      │ 4. Prepare request
      ▼
   Axios Instance
      │
      │ 5. Add auth token (interceptor)
      │ 6. Add headers
      │
      │ 7. Send HTTP request
      ▼
   Backend API
      │
      │ 8. Process request
      │ 9. Return response
      ▼
   Axios Instance
      │
      │ 10. Handle response (interceptor)
      │ 11. Check for errors
      ▼
   React Query
      │
      │ 12. Update cache
      │ 13. Trigger re-render
      ▼
   Component
      │
      └─ Display data
```

## 🎯 Feature Implementation Pattern

```
1. Define Types (types/index.ts)
   └─ Interface definitions

2. Create Validation Schema (lib/validations.ts)
   └─ Zod schema

3. Create Service (services/*.service.ts)
   └─ API calls

4. Create Hooks (hooks/*.ts)
   └─ React Query hooks

5. Create Components (components/*)
   └─ UI components

6. Create Pages (pages/*.tsx)
   └─ Page composition

7. Add Routes (App.tsx)
   └─ Route configuration
```

## 📦 Bundle Structure

```
dist/
├── index.html          ← Entry point
├── assets/
│   ├── index-[hash].js  ← Main JS bundle
│   ├── index-[hash].css ← Compiled styles
│   └── [icons].svg      ← Icon assets
└── [other assets]
```

This architecture provides:
✅ Clear separation of concerns
✅ Scalable structure
✅ Easy to test
✅ Type-safe
✅ Performant
✅ Maintainable
