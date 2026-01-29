---
name: Project Issues Documentation
overview: Comprehensive analysis of the XITE Platform frontend issues with detailed solutions for access management, cache removal, and layout improvements while maintaining the modular folder structure.
todos:
  - id: install-casl
    content: Install CASL libraries (@casl/ability, @casl/react) and create ability definition structure
    status: completed
  - id: create-ability-definitions
    content: Create define-ability.ts with role-based permissions and TypeScript types
    status: completed
  - id: implement-access-middleware
    content: Create check-access.ts middleware for server-side permission enforcement
    status: completed
  - id: create-client-hooks
    content: Implement useAbility and useCan hooks for client-side permission checks
    status: completed
  - id: update-server-actions
    content: Add requireAccess() calls to all server actions (60+ files) before database operations
    status: completed
  - id: migrate-client-components
    content: Replace PermissionGate with CASL Can component in 67 component files
    status: completed
  - id: remove-redis-cache
    content: Remove Redis cache from authentication (getCache/setCache calls)
    status: completed
  - id: remove-react-cache
    content: Remove React cache() wrapper from getUserCached function
    status: completed
  - id: delete-unused-cache
    content: Delete unused cache-config.ts file and Redis service files
    status: completed
  - id: create-spacing-config
    content: Create spacing-config.ts with consistent spacing constants
    status: completed
  - id: improve-header
    content: Improve existing Header component (TopBar + MobileNav) for better UX
    status: completed
  - id: improve-protected-layout
    content: Improve protected layout spacing and structure (no sidebar changes)
    status: completed
  - id: create-page-container
    content: Implement PageContainer component for consistent page structure
    status: completed
  - id: update-list-layouts
    content: Update ListPageLayout and other layout components with new spacing system
    status: completed
  - id: test-permissions
    content: Test access control thoroughly across all resources and actions
    status: completed
  - id: test-responsive-layouts
    content: Test layout responsiveness on mobile, tablet, and desktop devices
    status: completed
isProject: false
---

# Project Issues & Solutions Documentation

## Executive Summary

This document provides a detailed analysis of the XITE Platform frontend project, identifying critical issues in **access management**, **caching**, and **layout structure**, along with best-practice solutions that align with the specified tech stack.

---

## Current Tech Stack

### Confirmed Technologies

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Firebase (client) + Firebase Admin (server)
- **Databases**: 
  - PostgreSQL (via Prisma) - Main data
  - MongoDB (via Mongoose) - CMS data
- **ORM**: Prisma (for PostgreSQL)
- **UI Libraries**: ShadCN UI + React Hook Form + TanStack Table
- **Validation**: Zod v4.1.13
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Caching**: Next.js cache (revalidatePath/revalidateTag)

### Current Dependencies

```json
{
  "firebase": "^12.6.0",
  "firebase-admin": "^13.6.0",
  "@prisma/client": "^7.1.0",
  "mongoose": "^9.0.1",
  "react-hook-form": "^7.68.0",
  "@tanstack/react-table": "^8.21.3",
  "zod": "^4.1.13"
}
```

**Note**: `ioredis` can be removed if only used for auth caching

---

## 🔴 Issue #1: Access Management - Critical

### Current State Analysis

#### File Structure

```
app/modules/common/authentication/
├── firebase/
│   ├── action.ts              # Login/logout/getUser
│   ├── auth.ts                # Firebase Admin setup
│   ├── client.ts              # Firebase client config
│   └── auth-context.tsx       # React context provider
└── access-control/
    ├── index.ts               # Permissions definition
    ├── lib/
    │   ├── check-permission.ts        # Core hasPermission()
    │   ├── check-permission-server.ts # Server-side check
    │   └── check-permission-client.ts # Client-side hook
    └── components/
        └── permission-gate.tsx        # Conditional render component
```

#### Permission Definition ([access-control/index.ts](app/modules/common/authentication/access-control/index.ts))

```typescript
export const permissions: Permissions = {
  Admin: {
    Program: ["read", "write", "update", "delete"],
    Cohort: ["read", "write", "update", "delete"],
    Faculty: ["read", "write", "update", "delete"],
    AcademicPartners: ["read", "write", "update", "delete"],
    Enterprise: ["read", "write", "update", "delete"],
    Microsite: ["read", "write", "update", "delete"],
    Topic: ["read", "write", "update", "delete"],
    Template: ["read", "write", "update", "delete"],
  },
  User: {
    Program: ["read", "write", "update"],
    Cohort: ["read", "write", "update"],
    Microsite: ["read", "write", "update"],
  },
};
```

#### Usage Statistics

- **182 usages** across **67 files**
- Heavily used in: page components, server actions, layout components, table actions

### Problems Identified

#### 1. **Inconsistent Permission Checks**

- Server actions don't consistently check permissions at operation start
- Example: Some actions check permissions, others don't

#### 2. **Firebase-Prisma Role Separation**

- Firebase manages authentication
- Prisma stores roles separately
- No synchronization issues (will remove caching)

#### 3. **Poor Role Management**

- Only 2 roles: "Admin" and "User"
- No middleware enforcement
- Hard-coded permissions object
- No database-driven permissions
- Ownership checks scattered ([modules/user/utils/index.ts](app/modules/user/utils/index.ts))

#### 4. **Access Control Issues**

```typescript
// Current: No enforcement at operation level
export async function updateProgramAction(id: string, data: any) {
  // ❌ No permission check here
  const result = await primaryDB.program.update({
    where: { id },
    data
  });
  revalidatePath(MODULE_PATH);
  return result;
}
```

#### 5. **Unnecessary Caching Complexity**

Current Redis caching adds complexity without significant benefit:

- Requires Redis infrastructure
- Potential for stale data
- Permission changes don't take effect immediately
- Direct database queries are fast enough

### ✅ Recommended Solution

#### Strategy: Enhanced RBAC with CASL Library

**Why CASL?**

- Industry-standard for JavaScript RBAC
- Works seamlessly with Firebase + Prisma
- Type-safe
- Supports complex permissions
- Easy to test
- Well-documented

#### Implementation Plan

##### 1. **Install CASL**

```bash
npm install @casl/ability @casl/react
```

##### 2. **New File Structure**

```
app/modules/common/authentication/access-control/
├── abilities/
│   ├── define-ability.ts      # Ability definition based on roles
│   ├── types.ts               # TypeScript types
│   └── can.tsx                # React component for conditional rendering
├── middleware/
│   ├── check-access.ts        # Middleware for server actions
│   └── check-route-access.ts # Route-level protection
├── permissions/
│   ├── roles.ts               # Role definitions
│   └── resources.ts           # Resource definitions
└── hooks/
    ├── use-ability.ts         # Client-side hook
    └── use-can.ts             # Simplified permission check
```

##### 3. **Define Abilities ([abilities/define-ability.ts](app/modules/common/authentication/access-control/abilities/define-ability.ts))**

```typescript
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { UserRole } from '@/modules/common/database/prisma/generated/prisma';

export type Action = 'read' | 'create' | 'update' | 'delete' | 'manage';
export type Subject = 
  | 'Program' 
  | 'Cohort' 
  | 'Faculty' 
  | 'AcademicPartner' 
  | 'Enterprise' 
  | 'Microsite' 
  | 'Topic' 
  | 'Template'
  | 'all';

export type AppAbility = PureAbility<[Action, Subject]>;

export function defineAbilityFor(roles: UserRole[], userId?: string) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

  const roleNames = roles.map(r => r.role);

  if (roleNames.includes('Admin')) {
    // Admin can do everything
    can('manage', 'all');
  } else if (roleNames.includes('User')) {
    // User permissions
    can(['read', 'create', 'update'], 'Program');
    can(['read', 'create', 'update'], 'Cohort');
    can(['read', 'create', 'update'], 'Microsite');
    can('read', 'Faculty');
    can('read', 'AcademicPartner');
    can('read', 'Enterprise');
    can('read', 'Topic');
  }

  return build();
}
```

##### 4. **Server-Side Access Middleware ([middleware/check-access.ts](app/modules/common/authentication/access-control/middleware/check-access.ts))**

```typescript
import { getUserRoles } from '@/modules/common/authentication/firebase/action';
import { defineAbilityFor, Action, Subject } from '../abilities/define-ability';

export async function checkAccess(action: Action, subject: Subject): Promise<boolean> {
  const roles = await getUserRoles();
  
  if (!roles || roles.length === 0) {
    return false;
  }
  
  const ability = defineAbilityFor(roles);
  return ability.can(action, subject);
}

export async function requireAccess(action: Action, subject: Subject) {
  const hasAccess = await checkAccess(action, subject);
  
  if (!hasAccess) {
    throw new Error(`Unauthorized: Cannot ${action} ${subject}`);
  }
}
```

##### 5. **Client-Side Hook ([hooks/use-ability.ts](app/modules/common/authentication/access-control/hooks/use-ability.ts))**

```typescript
'use client';

import { useMemo } from 'react';
import { useAuth } from '@/modules/common/authentication/firebase/auth-context';
import { defineAbilityFor } from '../abilities/define-ability';

export function useAbility() {
  const { roles, dbUser, loading } = useAuth();
  
  const ability = useMemo(() => {
    if (loading || !roles || roles.length === 0) {
      return null;
    }
    return defineAbilityFor(roles, dbUser?.id);
  }, [roles, dbUser, loading]);
  
  return { ability, loading };
}

export function useCan(action: Action, subject: Subject) {
  const { ability, loading } = useAbility();
  
  if (loading || !ability) {
    return false;
  }
  
  return ability.can(action, subject);
}
```

##### 6. **React Component ([abilities/can.tsx](app/modules/common/authentication/access-control/abilities/can.tsx))**

```typescript
'use client';

import { ReactNode } from 'react';
import { useAbility } from '../hooks/use-ability';
import { Action, Subject } from './define-ability';

interface CanProps {
  I: Action;
  a: Subject;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ I, a, children, fallback = null }: CanProps) {
  const { ability, loading } = useAbility();
  
  if (loading) {
    return null;
  }
  
  if (!ability || !ability.can(I, a)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
```

##### 7. **Usage in Server Actions**

```typescript
// Before (PROBLEMATIC)
export async function updateProgramAction(id: string, data: any) {
  const result = await primaryDB.program.update({
    where: { id },
    data
  });
  return result;
}

// After (SECURE)
export async function updateProgramAction(id: string, data: any) {
  await requireAccess('update', 'Program'); // ✅ Permission check FIRST
  
  const result = await primaryDB.program.update({
    where: { id },
    data
  });
  return result;
}
```

##### 8. **Usage in Components**

```typescript
// Before
<PermissionGate resource="Program" action="update">
  <UpdateButton />
</PermissionGate>

// After
<Can I="update" a="Program">
  <UpdateButton />
</Can>
```

##### 9. **Migration Path**

1. Install CASL
2. Create new ability files
3. Implement parallel to existing system
4. Update critical server actions first (write/update/delete operations)
5. Update client components
6. Remove old permission system
7. Add tests

##### 10. **Simplified Auth Flow (No Cache)**

**Problem**: Redis cache adds complexity and can cause stale permission data

**Solution**: Remove Redis caching entirely, rely on direct database queries

```typescript
// In firebase/action.ts - Simplified without Redis
export async function getUser(): Promise<...> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) return null;

    const decodedToken = await adminAuth().verifySessionCookie(session.value);
    const uid = decodedToken.uid;

    // Direct fetch - no caching
    const user = await adminAuth().getUser(uid);
    const dbUser = await primaryDB.user.findUnique({
      where: { email: user.email },
      include: { roles: true },
    });

    if (!dbUser || !dbUser.roles) return null;

    return {
      user: user.toJSON() as UserRecord,
      roles: dbUser.roles,
      dbUser: dbUser,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
```

**Benefits**:

- No stale data - always fresh permissions
- Simpler code - no cache invalidation logic needed
- No Redis infrastructure required
- Permission changes take effect immediately

---

## 🟡 Issue #2: Cache Removal

### Current Cache Usage

#### 1. **Redis Cache** ❌ TO BE REMOVED

- **Location**: `[app/modules/common/services/redis/](app/modules/common/services/redis/)`
- **Usage**: Authentication data caching ([firebase/action.ts](app/modules/common/authentication/firebase/action.ts))
- **TTL**: 10 minutes
- **Problem**: Adds complexity, requires Redis infrastructure, causes stale data issues

```typescript
// Current usage - TO BE REMOVED
const cached = await getCache<{
  user: UserRecord;
  roles: UserRole[];
  dbUser: DbUser;
}>(cacheKey);

if (cached) {
  return cached;
}

await setCache(cacheKey, payload, 600); // 10 minutes
```

#### 2. **Next.js Cache (revalidatePath/revalidateTag)** ✅ KEEP

- **60+ files** using `revalidatePath`
- Used in all CRUD action files across modules:
  - Programs, Cohorts, Faculty, Enterprises, Topics, etc.

**Example** ([program/components/forms/update/action.ts](app/modules/program/components/forms/update/action.ts)):

```typescript
export async function updateProgramAction(id: string, data: any) {
  const result = await primaryDB.program.update({
    where: { id },
    data
  });
  revalidatePath(MODULE_PATH);  // ✅ Keep this - Next.js built-in caching
  return result;
}
```

**Decision**: **KEEP** Next.js revalidation - it's built-in, efficient, and provides good UX

#### 3. **React Cache** ❌ TO BE REMOVED

- **Location**: [firebase/action.ts](app/modules/common/authentication/firebase/action.ts)
- **Usage**: Request-level memoization

```typescript
import { cache } from "react";

const getUserCached = cache(async () => {
  // Prevents duplicate calls in same request - TO BE REMOVED
});
```

**Decision**: Remove to simplify auth flow and rely on database query speed

#### 4. **Unused Cache Config** ❌ TO BE REMOVED

- **File**: `[app/modules/common/lib/cache-config.ts](app/modules/common/lib/cache-config.ts)`
- **Status**: Defined but **not imported/used** anywhere

### ✅ Removal Strategy

#### Phase 1: Remove Redis Cache from Authentication

**Files to Update**:

- `[app/modules/common/authentication/firebase/action.ts](app/modules/common/authentication/firebase/action.ts)`

**Changes**:

```typescript
// BEFORE (with Redis cache)
const getUserCached = cache(
  async (): Promise<...> => {
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get("session");

      if (!session) return null;

      const decodedToken = await adminAuth().verifySessionCookie(session.value);
      const uid = decodedToken.uid;

      // Check Redis
      const cacheKey = `auth:user:${uid}`;
      const cached = await getCache<{...}>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const user = await adminAuth().getUser(uid);
      const dbUser = await primaryDB.user.findUnique({
        where: { email: user.email },
        include: { roles: true },
      });

      if (!dbUser || !dbUser.roles) return null;

      const payload = {...};
      
      // Cache with Redis
      await setCache(cacheKey, payload, 600);
      
      return payload;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }
);

// AFTER (without Redis cache)
export async function getUser(): Promise<...> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) return null;

    const decodedToken = await adminAuth().verifySessionCookie(session.value);
    const uid = decodedToken.uid;

    // Fetch directly from Firebase + Prisma
    const user = await adminAuth().getUser(uid);
    const dbUser = await primaryDB.user.findUnique({
      where: { email: user.email },
      include: { roles: true },
    });

    if (!dbUser || !dbUser.roles) return null;

    return {
      user: user.toJSON() as UserRecord,
      roles: dbUser.roles,
      dbUser: dbUser,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
```

**Remove these imports**:

```typescript
import { cache } from "react";
import { getCache, setCache } from "../../services/redis/controllers";
```

#### Phase 2: Update Access Control (Remove Cache Invalidation Logic)

**Files to Update**:

- Remove `invalidateUserCache` function (no longer needed)
- Remove cache invalidation references from access control docs

#### Phase 3: Delete Unused Files

**Files to Delete**:

1. `[app/modules/common/lib/cache-config.ts](app/modules/common/lib/cache-config.ts)` - Unused config
2. `[app/modules/common/services/redis/](app/modules/common/services/redis/)` - Entire Redis service folder (connection.ts, controllers.ts)

**Note**: Only delete Redis if it's ONLY used for auth caching. If used elsewhere, keep the service but remove auth usage.

#### Phase 4: Update Dependencies (Optional)

If Redis is only used for auth caching, consider removing:

```bash
npm uninstall ioredis
```

**Check first**: Search for other Redis usage in the codebase

---

## 🟢 Issue #3: Layout Improvements

### Current Layout Structure

#### File Overview

```
app/app/
├── layout.tsx                    # Root layout (fonts, global styles)
└── (protected)/
    ├── layout.tsx                # Auth + Header + Main wrapper
    ├── cms/layout.tsx            # Permission check for CMS
    ├── microsites/layout.tsx     # Permission check for Microsites
    └── templates/layout.tsx      # Permission check for Templates

app/modules/common/components/
├── layouts/
│   ├── header/
│   │   ├── header.tsx            # Main header (TopBar + MobileNav)
│   │   ├── top-bar.tsx           # Desktop header
│   │   └── mobile-navigation.tsx # Mobile nav
│   ├── list-page-layout.tsx      # List page wrapper
│   ├── detail-page-header.tsx    # Detail page header
│   └── info-section.tsx          # Info display container
└── global/
    ├── sidebar/sidebar.tsx       # App sidebar
    └── page-header/index.tsx     # Dashboard page header
```

#### Current Protected Layout ([app/(protected)/layout.tsx](app/app/(protected)/layout.tsx))

```tsx
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  
  return (
    <AuthProvider>
      <article className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 xl:p-10 lg:p-10 p-5">{children}</main>
      </article>
    </AuthProvider>
  );
}
```

#### Current Header ([layouts/header/header.tsx](app/modules/common/components/layouts/header/header.tsx))

```tsx
export default function Header() {
  return (
    <header className="bg-background">
      <TopBar />
      <MobileNavigation />
    </header>
  );
}
```

### Problems Identified

#### 1. **Inconsistent Spacing**

- Main content: `xl:p-10 lg:p-10 p-5`
- List page layout: `p-8` wrapper + inner card with variable padding
- Creates nested padding issues

#### 2. **Current Header/Navigation Works**

- TopBar + MobileNavigation structure is functional
- Focus on improvements rather than restructuring

#### 3. **Permission Layouts Are Minimal**

```tsx
// cms/layout.tsx - just permission check, no actual layout
export default async function CMSLayout({ children }: { children: React.Nodechildren }) {
  const permission = await checkPermission("Microsite", "read") && 
                     await checkPermission("Template", "read");
  if (!permission) {
    return <UnauthorizedPageError />;
  }
  return <div>{children}</div>; // ← Just a div!
}
```

### ✅ Recommended Solutions

#### Solution 1: Improve Existing Header (No Sidebar)

**Keep Current Structure** but enhance it:

```tsx
// layouts/header/header.tsx - Keep as is, just refine
export default function Header() {
  return (
    <header className="bg-background border-b">
      <TopBar />
      <MobileNavigation />
    </header>
  );
}
```

**Potential Header Improvements**:

- Add border-bottom for better visual separation
- Ensure consistent padding across TopBar
- Improve mobile navigation transitions
- Better accessibility (aria-labels, keyboard navigation)
- Optimize performance (memoization if needed)

**Updated Protected Layout** (improved spacing only):

```tsx
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
```

**Changes**:

- Changed `<article>` to `<div>` (more semantic)
- Consistent responsive padding: `p-4 md:p-6 lg:p-8 xl:p-10`
- No sidebar components

#### Solution 2: Consistent Spacing System

**Define spacing constants**:

```typescript
// app/modules/common/lib/spacing-config.ts
export const LAYOUT_SPACING = {
  page: {
    mobile: 'p-4',
    tablet: 'md:p-6',
    desktop: 'lg:p-8',
    wide: 'xl:p-10',
  },
  card: {
    mobile: 'p-4',
    tablet: 'md:p-6',
    desktop: 'lg:p-8',
  },
  section: {
    mobile: 'space-y-4',
    tablet: 'md:space-y-6',
    desktop: 'lg:space-y-8',
  },
} as const;

export const PAGE_PADDING = 'p-4 md:p-6 lg:p-8 xl:p-10';
export const CARD_PADDING = 'p-4 md:p-6 lg:p-8';
export const SECTION_SPACING = 'space-y-4 md:space-y-6 lg:space-y-8';
```

**Updated List Page Layout**:

```tsx
import { PAGE_PADDING, CARD_PADDING } from '@/modules/common/lib/spacing-config';

export default function ListPageLayout({ title, children, headerActions }: ListPageLayoutProps) {
  return (
    <div className="w-full h-full">
      <div className={`bg-card shadow-sm rounded-lg ${CARD_PADDING}`}>
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {headerActions}
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
```

#### Solution 3: Enhanced Permission Layouts

```tsx
// cms/layout.tsx - Enhanced but simple
export default async function CMSLayout({ children }: { children: React.ReactNode }) {
  const permission = await checkPermission("Microsite", "read") && 
                     await checkPermission("Template", "read");
  
  if (!permission) {
    return <UnauthorizedPageError />;
  }
  
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
```

**Note**: Keep layouts simple, don't add unnecessary wrappers

#### Solution 4: Page Layout Components Hierarchy

**Recommended Structure** (No Sidebar):

```
<ProtectedLayout>              ← Auth + Header + Main padding
  <SectionLayout>              ← Optional: Section-specific layout (minimal)
    <PageContainer>            ← Consistent page wrapper
      <PageHeader />           ← Title + actions
      <PageContent>            ← Main content area
        <Card>                 ← Data display
          {children}
        </Card>
      </PageContent>
    </PageContainer>
  </SectionLayout>
</ProtectedLayout>
```

**Key Point**: Keep current header/navigation structure, just improve spacing and consistency

**New Component**: `PageContainer`

```tsx
// layouts/page-container.tsx
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl';
}

export function PageContainer({ children, maxWidth = '7xl' }: PageContainerProps) {
  const widthClasses = {
    full: 'w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl',
  };
  
  return (
    <div className={`mx-auto w-full ${widthClasses[maxWidth]} space-y-6`}>
      {children}
    </div>
  );
}
```

---

## Implementation Priority

### Phase 1: Critical (Week 1)

1. **Cache Removal** (Do this FIRST - simplifies auth)
  - Remove Redis cache from `firebase/action.ts`
  - Remove React `cache()` wrapper from auth
  - Delete unused `cache-config.ts`
  - Delete Redis service files (if only used for auth)
2. **Access Management**
  - Install CASL
  - Create ability definitions
  - Add `requireAccess()` to all server actions with write/update/delete operations

### Phase 2: High Priority (Week 2)

1. **Layout - Foundation**
  - Create spacing config
  - Improve protected layout spacing (no sidebar)
  - Enhance existing Header component if needed

### Phase 3: Medium Priority (Week 3)

1. **Access Management - Complete**
  - Update all remaining server actions
  - Migrate client components to use `<Can>` component
  - Remove old permission system
2. **Layout - Components**
  - Create `PageContainer` component
  - Update `ListPageLayout`
  - Update `DetailPageHeader`
  - Standardize spacing across all pages

### Phase 4: Testing & Refinement (Week 4)

1. Test permission system thoroughly
2. Test responsive layouts on mobile/tablet/desktop
3. Performance testing (auth queries should be fast)
4. Documentation updates

---

## Migration Checklist

### Access Management

- Install `@casl/ability` and `@casl/react`
- Create ability definition files
- Create middleware functions
- Create client hooks
- Update 60+ server action files
- Update 67 component files using permissions
- Implement cache invalidation
- Remove old permission system
- Write tests

### Cache Removal

- ✅ Keep `revalidatePath` and `revalidateTag` (Next.js built-in)
- ❌ Remove Redis cache from `firebase/action.ts`
- ❌ Remove React `cache()` wrapper from auth
- ❌ Remove `getCache` and `setCache` imports
- ❌ Delete `cache-config.ts`
- ❌ Delete Redis service files: `app/modules/common/services/redis/` (if only used for auth)
- ❌ Optionally remove `ioredis` dependency (check for other usage first)
- ✅ Test auth performance without caching
- ✅ Verify permission changes take effect immediately

### Layout Improvements

- Create `spacing-config.ts`
- Update `(protected)/layout.tsx` with consistent padding
- Improve existing `Header` component (TopBar + MobileNav)
- Create `PageContainer` component
- Update `ListPageLayout` with new spacing system
- Update `DetailPageHeader` with consistent styling
- Improve permission layouts (cms/microsites/templates)
- Test responsive behavior
- Test on mobile devices

**Note**: NO sidebar implementation - keep current header/nav structure

---

## Risk Assessment

### High Risk

- **Access Management Changes**: Could break existing functionality if not careful
  - **Mitigation**: Implement parallel system, test thoroughly, staged rollout

### Medium Risk

- **Layout Changes**: Could affect user experience
  - **Mitigation**: Test on multiple devices, get user feedback

### Low Risk

- **Redis Cache Removal**: Minimal impact (auth queries are fast)
  - **Mitigation**: Monitor auth query performance, PostgreSQL is fast enough for user lookups

### Very Low Risk

- Spacing standardization
- Unused file deletion
- React cache() removal

---

## Success Metrics

### Access Management

- ✅ All server actions check permissions before execution
- ✅ Permission changes reflect within 2 minutes
- ✅ Zero unauthorized operations
- ✅ Type-safe permission checks

### Cache Removal

- ✅ Zero cache-related bugs
- ✅ Fresh auth data on every request
- ✅ Permission changes take effect immediately
- ✅ Acceptable auth query performance (<200ms)

### Layout Improvements

- ✅ Consistent spacing across all pages
- ✅ Responsive on mobile, tablet, desktop
- ✅ Current header/navigation working smoothly
- ✅ Improved user experience with better spacing
- ✅ Page layouts are standardized

---

## Additional Recommendations

### 1. Environment Variables

Ensure these are set:

```env
# Firebase
FIREBASE_ADMIN_CREDENTIALS=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...

# Databases
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb://...

# Redis (Optional - can be removed if only used for auth caching)
# REDIS_HOST=localhost
# REDIS_PORT=6379
```

### 2. Database Schema Updates

Consider adding permission audit trail:

```prisma
model PermissionAuditLog {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  action     String
  resource   String
  allowed    Boolean
  timestamp  DateTime @default(now())
}
```

### 3. Monitoring

Add logging for:

- Failed permission checks
- Auth query performance (to verify no performance degradation after Redis removal)
- Layout render times
- Database query times for user/role lookups

---

## Conclusion

This documentation provides a comprehensive roadmap for addressing the three critical issues in the XITE Platform frontend. The solutions are designed to be:

- **Secure**: CASL provides industry-standard RBAC
- **Maintainable**: Modular folder structure preserved
- **Scalable**: Easy to add new roles and permissions
- **Modern**: Uses latest Next.js and React patterns
- **Type-safe**: Full TypeScript support

Implementation should follow the phased approach to minimize risk and ensure thorough testing at each stage.