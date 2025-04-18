# VEDA MDX Editor

A proof-of-concept (POC) implementation for integrating MDXEditor with VEDA components, enabling rich content editing capabilities for VEDA datasets and maps. This implementation includes a custom editor interface that supports VEDA-specific components and preview functionality.

## Overview

This PR implements a proof-of-concept (POC) for integrating MDXEditor with VEDA components, enabling rich content editing capabilities for VEDA datasets and maps. The implementation includes a custom editor interface that supports VEDA-specific components and preview functionality.

## Architecture

The implementation follows a modular architecture with the following key components:

### Core Components
- `MDXEditor.tsx`: Main editor component that integrates with @mdxeditor/editor
- `MapEditor.tsx`: Specialized editor for VEDA map components
- `MDXPreview.tsx`: Preview component for rendered MDX content
- `MapPreview.tsx`: Preview component for VEDA map components

### Supporting Infrastructure
- `MapContext.tsx`: Context provider for map-related state management
- `components.jsx`: Custom component registry for VEDA components

### Plugins
- `remark-scrollytelling.ts`: Custom remark plugin for scrollytelling support
- `scrollytelling/`: Directory containing scrollytelling-related components

## Key Features

- **Rich Text Editing**: Full MDX editing capabilities with VEDA-specific components
- **Map Component Integration**: Support for VEDA map components with preview functionality
- **Custom Plugins**: Integration of custom remark plugins for enhanced functionality
- **Preview System**: Real-time preview of both MDX content and map components
- **Context Management**: State management for map-related data and configurations

## Implementation Status

- ✅ **Map Component**: Fully functional with preview support
- ❌ **Scrollytelling**: Currently not working (code left in place for future implementation)
  - The scrollytelling plugin and components are included but not fully integrated
  - Future work will focus on completing this functionality

## Technical Implementation

- Uses `@mdxeditor/editor` as the base editor
- Integrates with VEDA's existing component system
- Implements custom preview components for VEDA-specific features
- Maintains compatibility with existing VEDA data structures

## Files Modified/Added

```
app/components/mdx-editor/
├── components/
│   ├── MapPreview.tsx
│   ├── MDXPreview.tsx
│   ├── MapEditor.tsx
│   ├── MDXEditor.tsx
│   └── components.jsx
├── utils/
│   └── MapContext.tsx
└── plugins/
    ├── scrollytelling/
    └── remark-scrollytelling.ts
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```
4. Run the development server:
   ```bash
   yarn dev
   ```
5. Access the editor at http://localhost:3000/editor

## Testing

- Manual testing of editor functionality
- Preview system validation
- Map component integration testing
- MDX rendering verification

## Future Improvements

- Complete scrollytelling implementation
- Add more VEDA component support
- Enhance preview system
- Implement additional custom plugins
- Add unit tests
- Improve error handling

## Dependencies

- @mdxeditor/editor
- @teamimpact/veda-ui
- @devseed-ui/theme-provider
