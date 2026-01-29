# Audit Logs Module

This module provides a comprehensive audit logging system for tracking all changes and user activities across the XITE platform.

## Overview

The audit logging system captures:
- User information (ID, name, email)
- Action types (CREATE, UPDATE, DELETE, APPROVE, REJECT, ARCHIVED, etc.)
- Record details (ID, name, type)
- Database type (PostgreSQL or MongoDB)
- Initial and final values
- Timestamps

## Components

### 1. MongoDB Model
Located at: `app/modules/common/database/mongodb/models/audit-log.ts`

Defines the schema for audit log entries with the following fields:
- `userId`, `userName`, `userEmail` - User who performed the action
- `actionType` - Type of action performed
- `recordId`, `recordName`, `recordType` - Details of the affected record
- `databaseType` - Source database (postgresql or mongodb)
- `initialValue`, `finalValue` - Data before and after the change
- `ipAddress`, `userAgent`, `metadata` - Additional context

### 2. Audit Logger Utility
Located at: `app/modules/common/lib/audit-logger.ts`

Provides helper functions for logging different types of operations:
- `createAuditLog()` - Generic audit log creation
- `logCreate()` - For CREATE operations
- `logUpdate()` - For UPDATE operations
- `logDelete()` - For DELETE operations
- `logApprove()` - For APPROVE operations
- `logReject()` - For REJECT operations
- `logArchive()` - For ARCHIVED operations

### 3. Server Actions
Located at: `app/modules/audit-log/components/forms/read/action.ts`

Provides the following server actions:
- `getAuditLogsAction()` - Get all audit logs with filtering and pagination
- `getRecordAuditLogsAction()` - Get audit logs for a specific record
- `getAuditLogStatsAction()` - Get audit log statistics

### 4. UI Components
- **Table Component**: `app/modules/audit-log/components/tables/main/table.tsx`
  - Displays audit logs in a filterable, paginated table
  - Search by user, record name
  - Filter by action type, record type, database type
  
- **Schema**: `app/modules/audit-log/components/tables/main/schema.tsx`
  - Defines table columns with proper formatting
  - Includes data view dialogs for initial/final values

- **Page**: `app/app/(protected)/audit-logs/page.tsx`
  - Main audit logs page (only accessible to admins)

## Integration Guide

To integrate audit logging into your server actions, follow these steps:

### 1. Import the Required Functions

```typescript
import { logCreate, logUpdate, logDelete } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";
```

### 2. For CREATE Operations

```typescript
export async function createResourceAction(data: CreateSchema) {
  try {
    // ... your create logic ...
    const resource = await primaryDB.resource.create({
      data: data,
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "ResourceType", // e.g., "Program", "Faculty", "Topic"
          resource.id,
          resource.name, // or any identifying field
          "postgresql", // or "mongodb"
          resource, // Final value
          { /* optional metadata */ }
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    return resource;
  } catch (error) {
    throw error;
  }
}
```

### 3. For UPDATE Operations

```typescript
export async function updateResourceAction(data: UpdateSchema, recordId: string) {
  try {
    // Get initial value before update
    const initialResource = await primaryDB.resource.findUnique({
      where: { id: recordId },
    });

    // ... your update logic ...
    const resource = await primaryDB.resource.update({
      where: { id: recordId },
      data: data,
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "ResourceType",
          resource.id,
          resource.name,
          "postgresql",
          initialResource, // Initial value
          resource, // Final value
          { /* optional metadata */ }
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    return resource;
  } catch (error) {
    throw error;
  }
}
```

### 4. For DELETE Operations

```typescript
export async function deleteResourceAction(recordId: string) {
  try {
    // Get resource data before deletion
    const resourceToDelete = await primaryDB.resource.findUnique({
      where: { id: recordId },
    });

    if (!resourceToDelete) {
      throw new Error("Resource not found");
    }

    // ... your delete logic ...
    const resource = await primaryDB.resource.delete({
      where: { id: recordId },
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logDelete(
          user.uid,
          user.name || user.email || "Unknown User",
          "ResourceType",
          resource.id,
          resourceToDelete.name,
          "postgresql",
          resourceToDelete // Initial value
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    return resource;
  } catch (error) {
    throw error;
  }
}
```

### 5. For MongoDB Operations

For MongoDB operations, use the same pattern but change the `databaseType` parameter to `"mongodb"`:

```typescript
await logCreate(
  user.uid,
  user.name || user.email || "Unknown User",
  "Template",
  template._id.toString(),
  template.name,
  "mongodb", // <-- Changed from "postgresql"
  template
);
```

## Important Notes

1. **Error Handling**: Audit logging is wrapped in try-catch blocks to ensure that logging failures don't break the main operation.

2. **User Information**: Always use `getAuthUser()` to get the current user information for audit logs.

3. **Record Types**: Use consistent naming for record types (e.g., "Program", "Cohort", "Faculty", "AcademicPartner", "Enterprise", "Topic", "Template").

4. **Database Types**: Use "postgresql" for Prisma/PostgreSQL operations and "mongodb" for Mongoose/MongoDB operations.

5. **Data Sensitivity**: Be careful about what data you store in `initialValue` and `finalValue`. Avoid storing sensitive information like passwords or tokens.

6. **Performance**: Audit logging is asynchronous and doesn't block the main operation. However, for high-volume operations, consider batching audit logs or using a queue system.

## Access Control

The audit logs page and API endpoints are only accessible to users with admin privileges (those who have "manage all" permission). This is enforced through the `requireAccess("manage", "all")` middleware.

## Examples

The following modules have been updated with audit logging:
- Cohort CREATE: `app/modules/cohort/components/forms/create/action.ts`
- Cohort UPDATE: `app/modules/cohort/components/forms/update/action.ts`
- Cohort DELETE: `app/modules/cohort/components/forms/delete/action.ts`

Use these as reference implementations when adding audit logging to other modules.

## Next Steps

To complete the audit logging integration:

1. Add audit logging to all remaining CREATE actions in:
   - Academic Partner
   - Enterprise
   - Faculty
   - Program
   - Topic/Subtopic
   - Templates
   - Microsites

2. Add audit logging to all remaining UPDATE actions

3. Add audit logging to all remaining DELETE actions

4. Add audit logging for special operations like:
   - APPROVE/REJECT workflows
   - ARCHIVED operations
   - Status changes
   - Bulk operations

5. Consider adding audit logging for critical read operations (optional)
