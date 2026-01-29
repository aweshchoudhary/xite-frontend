# User Management Feature

## Overview

This feature enables Admins to manage users and their roles on the XITE Platform. Admins can:

- **Add users**: Create new user accounts with email, name, username
- **Remove users**: Delete user accounts from the system
- **Change roles**: Assign or modify user roles (Admin, User, etc.)
- **Activate/Deactivate users**: Control user access without deleting accounts

## Implementation Details

### Database Changes

The `User` model in Prisma schema has been updated with:

```prisma
model User {
  // ... existing fields
  isActive  Boolean  @default(true)  // New field for user activation status
  // ... rest of fields
}
```

### Module Structure

The user management feature follows the standard module structure:

```
app/modules/user/
├── components/
│   ├── forms/
│   │   ├── schema.ts                    # Zod validation schemas
│   │   ├── create/
│   │   │   ├── action.ts                # Server action for creating users
│   │   │   ├── form.tsx                 # Create user form component
│   │   │   ├── modal.tsx                # Modal wrapper for create form
│   │   │   └── context.tsx              # Form state management
│   │   ├── update/
│   │   │   ├── action.ts                # Server action for updating users
│   │   │   ├── form.tsx                 # Update user form component
│   │   │   ├── modal.tsx                # Modal wrapper for update form
│   │   │   └── context.tsx              # Form state management
│   │   ├── delete/
│   │   │   ├── action.ts                # Server action for deleting users
│   │   │   └── modal.tsx                # Delete confirmation modal
│   │   ├── toggle-active/
│   │   │   └── action.ts                # Server action for activate/deactivate
│   │   └── read/
│   │       └── action.ts                # Server actions for fetching users
│   └── tables/
│       └── user-table/
│           ├── schema.tsx               # Table column definitions
│           ├── table.tsx                # Table component
│           └── table-actions.tsx        # Row action buttons
├── contants/
│   └── index.ts                         # Module constants
└── utils/
    └── index.ts                         # Utility functions

app/app/(protected)/users/
├── page.tsx                             # User list page
├── new/
│   └── page.tsx                         # Create user page
└── [id]/
    ├── page.tsx                         # View user page
    └── edit/
        └── page.tsx                     # Edit user page
```

### Features

#### 1. User List Page (`/users`)
- Displays all users in a sortable, filterable table
- Shows: Name, Email, Username, Roles, Status (Active/Inactive), Created Date
- Action menu for each user with Edit, Activate/Deactivate, and Delete options
- "New User" button to create users

#### 2. Create User Page (`/users/new`)
- Form fields:
  - Name (required)
  - Email (required)
  - Username (optional)
  - Roles (required, multiple selection)
  - Active Status (toggle switch)
- Email uniqueness validation
- Role validation

#### 3. View User Page (`/users/[id]`)
- Displays user details:
  - Name, Email, Username
  - Account status (Active/Inactive)
  - Creation date
  - Assigned roles (with badges)
- Header actions: Edit and Delete
- Avatar with fallback initials

#### 4. Edit User Page (`/users/[id]/edit`)
- Pre-filled form with current user data
- Can update: Name, Email, Username, Roles, Status
- Validation same as create form

#### 5. Delete User
- Confirmation modal before deletion
- Warns about irreversible action
- Includes audit logging

#### 6. Activate/Deactivate User
- Quick toggle from table actions menu
- Toast notification on success
- Audit logging for status changes

### Access Control

User management is **admin-only**. The `User` resource has been added to the CASL ability definitions:

```typescript
// Only Admin can manage users
if (roleNames.includes("Admin")) {
  can("manage", "all");  // Includes User management
}
```

All pages and actions are protected with:
- Server-side: `requireAccess()` middleware
- Client-side: `PermissionGate` component

### Server Actions

#### Create User (`createAction`)
- Validates email uniqueness
- Validates role names
- Creates user with role associations
- Logs to audit trail

#### Update User (`updateAction`)
- Fetches initial data for audit log
- Validates role changes
- Updates user and role associations
- Logs changes to audit trail

#### Delete User (`deleteAction`)
- Fetches user data before deletion
- Deletes user record
- Logs deletion to audit trail

#### Toggle Active Status (`toggleActiveAction`)
- Fetches initial data
- Toggles `isActive` boolean
- Logs status change to audit trail

#### Read Users (`getAllUsers`, `getOneUser`)
- Fetches users with role relationships
- Returns data for tables and forms

#### Get All Roles (`getAllRoles`)
- Fetches available roles for selection in forms

### Audit Logging

All CRUD operations are logged to MongoDB with:
- User performing the action
- Action type (create, update, delete)
- Resource type (User)
- Resource ID and name
- Timestamp
- Initial and final values (for updates)

### Security Features

1. **Email Domain Validation**: Only `@xedinstitute.org` emails can log in (enforced in auth layer)
2. **Admin-Only Access**: User management restricted to Admin role
3. **Email Uniqueness**: Prevents duplicate user emails
4. **Role Validation**: Ensures only valid roles are assigned
5. **Audit Trail**: All changes are logged for accountability

## Setup Instructions

### 1. Run Database Migration

```bash
cd /Users/aweshchoudhary/Documents/XED/Projects/xite/platform/frontend

# Run migration to add isActive field
npx prisma migrate dev --name add_user_is_active_field --schema=app/modules/common/database/prisma/schema.prisma

# Generate Prisma client
npx prisma generate --schema=app/modules/common/database/prisma/schema.prisma
```

### 2. Seed Default Roles (if not exists)

Ensure the following roles exist in the `UserRole` table:
- Admin
- User

You can create them via Prisma Studio or database query:

```sql
INSERT INTO "UserRole" (id, role, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Admin', NOW(), NOW()),
  (gen_random_uuid(), 'User', NOW(), NOW())
ON CONFLICT (role) DO NOTHING;
```

### 3. Update Existing Users

If you have existing users without the `isActive` field, they will default to `true` (active).

### 4. Access the Feature

1. Log in as an Admin user
2. Navigate to `/users` in your browser
3. Start managing users!

## Usage Examples

### Creating a New User

1. Go to `/users`
2. Click "New User" button
3. Fill in:
   - Name: "John Doe"
   - Email: "john.doe@xedinstitute.org"
   - Username: "johndoe"
   - Roles: Select "User"
   - Active Status: Toggle on
4. Click "Create User"

### Changing User Roles

1. Go to `/users`
2. Find the user in the table
3. Click the three-dot menu (⋯)
4. Click "Edit"
5. Check/uncheck roles as needed
6. Click "Update User"

### Deactivating a User

1. Go to `/users`
2. Find the user in the table
3. Click the three-dot menu (⋯)
4. Click "Deactivate" (or "Activate" if already inactive)
5. Confirmation toast will appear

### Deleting a User

1. Go to `/users`
2. Find the user in the table
3. Click the three-dot menu (⋯)
4. Click "Delete"
5. Confirm in the modal
6. User will be permanently deleted

## Technical Notes

### Form Validation

Uses Zod schemas with React Hook Form:
- Email format validation
- Required field validation
- Role array validation (min 1 role required)

### Table Features

Using TanStack Table with:
- Column sorting
- Search/filtering (via DataTableView)
- Pagination
- Column visibility toggle

### Styling

- Uses shadcn/ui components
- Consistent with existing XITE Platform design
- Responsive layout
- Accessibility features (ARIA labels, keyboard navigation)

### Performance

- Server components for initial data fetching
- Client components for interactivity
- Optimistic UI updates where appropriate
- Proper caching and revalidation

## Future Enhancements

Potential improvements for future iterations:

1. **Bulk Operations**: Select multiple users for bulk role assignment or deletion
2. **User Invitations**: Send email invitations to new users
3. **Password Reset**: Allow admins to trigger password reset for users
4. **User Activity Log**: Display user login history and actions
5. **Advanced Filters**: Filter by role, status, creation date
6. **Export**: Export user list to CSV/Excel
7. **User Groups**: Create user groups for easier role management
8. **Session Management**: View and terminate active user sessions

## Troubleshooting

### Migration Issues

If the migration fails:
1. Check database connection in `.env`
2. Ensure PostgreSQL is running
3. Verify Prisma schema syntax
4. Run `npx prisma validate --schema=app/modules/common/database/prisma/schema.prisma`

### Access Denied

If you get "Unauthorized" errors:
1. Verify your user has the "Admin" role
2. Check access control configuration
3. Clear browser cache and cookies
4. Log out and log back in

### Roles Not Showing

If roles dropdown is empty:
1. Ensure UserRole records exist in database
2. Check `getAllRoles()` action
3. Verify database connection

## Support

For issues or questions about this feature, contact the development team or create an issue in the project repository.

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
**Author**: XITE Platform Team
