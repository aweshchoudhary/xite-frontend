# Faculty List Component

This component provides a comprehensive faculty management interface for the B2B program creation form.

## Features

- **Add Faculty**: Select and add faculty members from a searchable dialog
- **Remove Faculty**: Remove individual faculty members from the list
- **Sort Faculty**: Drag and drop to reorder faculty members
- **Visual Feedback**: Loading states, animations, and drag indicators

## File Structure

```
faculty-list/
├── index.tsx                    # Main component with add/remove/sort logic
├── draggable-wrapper.tsx        # DnD context wrapper for drag-and-drop functionality
├── sortable-item.tsx           # Individual faculty card with drag handle and remove button
├── faculty-select-popover.tsx  # Dialog for searching and selecting faculty
├── actions.ts                  # Server action for fetching faculty data
└── README.md                   # This file
```

## Usage

The component is integrated into the B2B program creation form:

```tsx
<Controller
  control={form.control}
  name="faculties"
  render={({ field, fieldState }) => (
    <FacultyList
      field={field}
      fieldState={fieldState}
      isRequired={requiredFields.includes("faculties")}
    />
  )}
/>
```

## Components

### FacultyList (index.tsx)
Main component that manages the faculty list state and handles:
- Adding new faculty members
- Removing faculty members
- Reordering faculty members
- Displaying empty state when no faculty are added

### SortableGrid (draggable-wrapper.tsx)
Wraps the faculty items in a DnD context using `@dnd-kit/core` and `@dnd-kit/sortable`:
- Enables drag-and-drop sorting
- Handles reordering logic
- Updates the form state when items are reordered

### SortableItem (sortable-item.tsx)
Individual faculty card that:
- Fetches faculty data by ID
- Displays faculty information using the shared `FacultyCard` component
- Provides drag handle for reordering
- Includes remove button
- Shows loading state while fetching data

### FacultySelectPopover (faculty-select-popover.tsx)
Dialog for selecting faculty:
- Searchable faculty list
- Filters out already selected faculty
- Uses Command component for better UX
- Displays faculty with avatar and name

## Dependencies

- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list functionality
- `@dnd-kit/utilities` - CSS utilities for transforms
- `react-hook-form` - Form state management
- `sonner` - Toast notifications

## Schema

The faculty list is stored as an array of UUIDs in the form schema:

```typescript
faculties: z.array(z.uuid()).min(1)
```

This requires at least one faculty member to be added to the program.
