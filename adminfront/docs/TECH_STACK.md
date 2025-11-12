# Tech Stack Documentation

## Overview

AdminFront is built with modern web technologies focusing on performance, developer experience, and scalability. This document provides detailed information about every technology used in the project.

---

## Core Framework

### Next.js 14.1.4

**Purpose**: React framework for production-grade applications

**Features Used**:
- **App Router**: Modern routing system with layouts and nested routes
- **Server Components**: Default server-side rendering for better performance
- **Client Components**: Interactive components with `'use client'` directive
- **Route Groups**: Organized routes with `(main)` grouping
- **Middleware**: Authentication and authorization layer
- **Image Optimization**: Automatic image optimization with `next/image`
- **Font Optimization**: Google Fonts optimization with `next/font`

**Configuration** (`next.config.mjs`):
```javascript
{
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "dob-ecommerce.s3.ap-southeast-1.amazonaws.com" }
    ]
  }
}
```

### React 18

**Purpose**: UI library for building user interfaces

**Features Used**:
- Functional components with hooks
- Concurrent rendering
- Automatic batching
- Suspense for data fetching
- Error boundaries
- Context API for state management

### TypeScript 5

**Purpose**: Type-safe JavaScript superset

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "baseUrl": "./src",
    "paths": {
      "@/lib/*": ["lib/*"],
      "@/components/*": ["components/*"],
      "@/actions/*": ["actions/*"],
      "@/services/*": ["services/*"],
      "@/modules/*": ["modules/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"]
    }
  }
}
```

**Key TypeScript Features**:
- Strict mode enabled
- Path aliases for clean imports
- Full type inference
- Interface-driven development
- Utility types (Omit, Pick, Partial, etc.)

---

## UI & Styling

### Ant Design 5.22.4

**Purpose**: Enterprise-class UI component library

**Components Used**:
- Layout: Layout, Header, Sider, Content
- Data Entry: Form, Input, Select, DatePicker, Upload, Checkbox, Radio, Switch
- Data Display: Table, Card, List, Avatar, Badge, Tag, Tooltip, Image
- Feedback: Modal, Message, Notification, Popconfirm, Spin, Skeleton
- Navigation: Menu, Breadcrumb, Dropdown, Pagination, Steps
- Other: Button, Typography, Collapse, Tabs, Empty

**Integration**:
```typescript
// Root layout with Ant Design Registry
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import theme from '../theme';

<AntdRegistry>
  <ConfigProvider theme={theme}>
    {children}
  </ConfigProvider>
</AntdRegistry>
```

**Theme Configuration** (`theme.tsx`):
```typescript
const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    // colorPrimary: '#52c41a', // Customizable
  },
};
```

**Related Packages**:
- `@ant-design/cssinjs@1.19.1`: CSS-in-JS solution
- `@ant-design/nextjs-registry@1.0.0`: Next.js 13+ integration

### Tailwind CSS 3.3.0

**Purpose**: Utility-first CSS framework

**Configuration** (`tailwind.config.ts`):
```typescript
{
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        warning: '#E7B008'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  corePlugins: {
    preflight: false, // Disabled to work with Ant Design
  },
  important: true, // Override Ant Design styles when needed
}
```

**Utility Functions**:
- `clsx@2.1.0`: Conditional class names
- `tailwind-merge@2.2.2`: Merge Tailwind classes intelligently
- `tailwindcss-animate@1.0.7`: Animation utilities

**Custom Utility** (`src/lib/utils.ts`):
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Styling Utilities

**class-variance-authority@0.7.0**
- Type-safe variant API for component styling
- Used for component variants and states

**lucide-react@0.364.0**
- Beautiful, consistent icon set
- Tree-shakeable icons
- TypeScript support

---

## State Management

### TanStack React Query 4.36.1

**Purpose**: Powerful asynchronous state management

**Configuration** (`src/lib/constants/query-client.ts`):
```typescript
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000, // 90 seconds
      retry: 1,
    },
  },
})
```

**Features Used**:
- Query caching and invalidation
- Automatic background refetching
- Optimistic updates
- Pagination support
- Infinite queries
- Mutation with rollback
- Query key management with factories
- Dependent queries
- Prefetching

**Query Keys Factory Pattern**:
```typescript
import { queryKeysFactory } from 'medusa-react';

const ADMIN_WAREHOUSE = 'admin_warehouse' as const;
export const adminWarehouseKeys = queryKeysFactory(ADMIN_WAREHOUSE);

// Generates:
// - adminWarehouseKeys.all()
// - adminWarehouseKeys.lists()
// - adminWarehouseKeys.list(query)
// - adminWarehouseKeys.details()
// - adminWarehouseKeys.detail(id)
```

---

## Backend Integration

### Medusa.js

**Packages**:
- `@medusajs/medusa-js@6.1.8`: JavaScript client SDK
- `medusa-react@9.0.16`: React hooks for Medusa
- `@medusajs/medusa@1.20.4`: Type definitions (dev dependency)

**Purpose**: Headless e-commerce platform

**Integration** (`src/lib/providers/medusa-provider.tsx`):
```typescript
import { MedusaProvider as Provider } from "medusa-react"
import { queryClient } from "../constants/query-client"
import { BACKEND_URL } from "../constants/medusa-backend-url"

export const MedusaProvider = ({ children }) => {
  return (
    <Provider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl={BACKEND_URL}
    >
      {children}
    </Provider>
  )
}
```

**Backend URL Configuration**:
```typescript
export const BACKEND_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000"
```

### HTTP Client

**axios@0.28.1**
- HTTP requests to backend API
- Request/response interceptors
- Automatic JSON transformation
- Error handling

**Custom Request Handler** (`src/services/request.js`):
- Adds authentication headers
- Handles errors globally
- Manages cookies for sessions

---

## Form Management

### React Hook Form

**@hookform/resolvers@3.3.4**

**Purpose**: Performant form validation library

**Features Used**:
- Uncontrolled components for performance
- Schema validation with Zod
- Error handling
- Field arrays for dynamic forms
- Watch and control field values
- Form state management

### Zod@3.22.4

**Purpose**: TypeScript-first schema validation

**Features Used**:
- Runtime type checking
- Schema composition
- Custom error messages
- Transform and refine
- Integration with React Hook Form

**Example Usage**:
```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

---

## Testing

### Jest 29.7.0

**Purpose**: JavaScript testing framework

**Configuration** (`jest.config.ts`):
- Test environment: jsdom
- Setup file: `jest.setup.ts`
- Coverage collection
- Module path mapping
- Transform with ts-jest

**Related Packages**:
- `@types/jest@29.5.12`: TypeScript types
- `jest-environment-jsdom@29.7.0`: DOM environment
- `ts-jest@29.1.2`: TypeScript transformer

### React Testing Library

**Packages**:
- `@testing-library/react@14.2.2`: React component testing
- `@testing-library/jest-dom@6.4.2`: Custom matchers
- `@testing-library/user-event@14.5.2`: User interaction simulation

**Purpose**: Test React components from user perspective

**Setup** (`jest.setup.ts`):
```typescript
import '@testing-library/jest-dom';
```

**Test Scripts**:
```json
{
  "test": "jest",
  "test:watch": "jest --watch"
}
```

### Cypress 13.7.3

**Purpose**: End-to-end testing framework

**Configuration** (`cypress.config.ts`):
```typescript
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

**Related Packages**:
- `@testing-library/cypress@10.0.1`: Testing Library integration

**Test Script**:
```json
{
  "cypress:open": "cypress open"
}
```

---

## File & Document Processing

### PDF Generation

**@react-pdf/renderer@3.4.4**
- Create PDF documents in React
- Invoice generation
- Report exports

**react-pdf@9.1.0**
- Display PDF files
- Document viewer
- Page navigation

### Excel Export

**xlsx@0.18.5**
- Export data to Excel format
- Import Excel files
- Data transformation
- Product imports/exports

---

## Utilities

### Date & Time

**dayjs@1.11.11**
- Modern date library (lightweight alternative to Moment.js)
- Date formatting and parsing
- Relative time
- Timezone support

**moment@2.30.1**
- Date manipulation
- Legacy support
- Date range calculations

### Lodash 4.17.21

**Purpose**: Utility library for common operations

**Functions Used**:
- `isEmpty`: Check empty values
- `intersection`: Array intersection
- `debounce`: Debounce functions
- `throttle`: Throttle functions
- `cloneDeep`: Deep cloning
- `get`: Safe property access
- `omit`: Object property removal
- `pick`: Object property selection

**TypeScript Support**:
- `@types/lodash@4.17.0`

---

## Progressive Web App

### next-pwa@5.6.0

**Purpose**: PWA support for Next.js

**Configuration** (`next.config.mjs`):
```javascript
import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

const pwaConfig = {
  disable: false,
  dest: 'public',
  runtimeCaching,
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);
```

**Features**:
- Service worker generation
- Offline support
- Runtime caching strategies
- Install prompts
- Manifest generation

**Manifest** (`public/manifest.json`):
- App metadata
- Icons
- Display modes
- Theme colors

---

## Build Tools

### PostCSS 8

**Purpose**: CSS transformation tool

**Configuration** (`postcss.config.js`):
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**autoprefixer@10.0.1**
- Automatic vendor prefixes
- Browser compatibility

### SWC

**Purpose**: Fast JavaScript/TypeScript compiler

**Configuration**:
- Built into Next.js 14
- Faster than Babel
- Used for compilation and minification

---

## Development Tools

### ESLint 8

**Purpose**: JavaScript/TypeScript linter

**Configuration** (`.eslintrc.json`):
```json
{
  "extends": "next/core-web-vitals"
}
```

**eslint-config-next@14.1.4**
- Next.js specific rules
- React best practices
- Accessibility rules

### Prettier

**Configuration** (`.prettierrc.json`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": true
}
```

---

## Additional Libraries

### UI Enhancements

**react-nestable@3.0.2**
- Drag and drop for nested lists
- Used in product categories
- Sortable tree structures

**next-themes@0.3.0**
- Theme switching (light/dark mode)
- System preference detection
- No flash on page load

### Type Utilities

**@types/node@20**: Node.js type definitions
**@types/react@18**: React type definitions
**@types/react-dom@18**: React DOM type definitions
**@types/uuid@9.0.8**: UUID type definitions

---

## Package Management

### Supported Package Managers

- **npm**: package-lock.json included
- **yarn**: yarn.lock included (preferred)
- **pnpm**: Compatible
- **bun**: Compatible

### Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "test:watch": "jest --watch",
  "cypress:open": "cypress open"
}
```

---

## Docker Support

**Dockerfile** included for containerization:

```dockerfile
# Multi-stage build
FROM node:20-alpine AS base
FROM base AS deps
FROM base AS builder
FROM base AS runner
```

**.dockerignore** configured to exclude:
- node_modules
- .next
- .git
- coverage
- test files

---

## Browser Support

### Target Browsers

Based on `browserslist` defaults:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

### Polyfills

- Automatic polyfills via Next.js
- Core-js integration
- CSS custom properties support

---

## Performance Considerations

### Bundle Size Optimization

1. **Tree Shaking**: Automatic with ES modules
2. **Code Splitting**: Route-based with Next.js
3. **Dynamic Imports**: For heavy components
4. **Image Optimization**: Automatic with next/image
5. **Font Optimization**: Automatic with next/font

### Caching Strategy

1. **Query Cache**: 90 second stale time
2. **Build Cache**: Incremental static regeneration
3. **Service Worker**: Runtime caching
4. **Browser Cache**: Static assets

---

## Security

### Security Features

1. **HTTPS**: Enforced in production
2. **CSRF Protection**: Token-based
3. **XSS Protection**: React escaping + CSP
4. **SQL Injection**: Parameterized queries (Medusa)
5. **Authentication**: JWT with httpOnly cookies
6. **Authorization**: Role-based access control

### Security Headers

Configured via Next.js:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

## Monitoring & Analytics

### Development Tools

- React DevTools support
- Next.js DevTools
- TanStack Query DevTools (can be added)

### Production Monitoring

Ready for integration with:
- Sentry (error tracking)
- Google Analytics
- Vercel Analytics
- Custom metrics

---

## Deployment

### Recommended Platforms

1. **Vercel** (Optimized for Next.js)
   - Zero configuration
   - Automatic HTTPS
   - Edge network
   - Preview deployments

2. **Docker** (Self-hosted)
   - Full control
   - Custom infrastructure
   - Kubernetes ready

3. **AWS/GCP/Azure**
   - Container services
   - Serverless options
   - Custom configurations

### Build Output

```bash
yarn build
# Generates:
# - .next/ directory with optimized bundles
# - Static assets in public/
# - Server functions for SSR
```

---

## Version History

Current versions as of project documentation:

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 14.1.4 | Framework |
| React | 18 | UI Library |
| TypeScript | 5 | Type Safety |
| Ant Design | 5.22.4 | UI Components |
| Tailwind CSS | 3.3.0 | Styling |
| TanStack Query | 4.36.1 | State Management |
| Medusa React | 9.0.16 | Backend Integration |
| Jest | 29.7.0 | Testing |
| Cypress | 13.7.3 | E2E Testing |

---

## Migration & Upgrade Paths

### Future Considerations

1. **Next.js 15**: Upgrade when stable
2. **React 19**: React Compiler support
3. **TanStack Query v5**: New features and improvements
4. **Ant Design 6**: When released

### Breaking Changes to Watch

- Next.js App Router evolution
- React Server Components updates
- Medusa v2 migration path
- TypeScript strict mode improvements

---

## Development Experience

### Key DX Features

1. **Hot Module Replacement**: Instant feedback
2. **TypeScript IntelliSense**: Full autocompletion
3. **Fast Refresh**: Preserve component state
4. **Path Aliases**: Clean imports
5. **Automatic Type Generation**: From Medusa schema
6. **Linting on Save**: Immediate feedback
7. **Testing Tools**: Fast unit and E2E tests

---

## Additional Resources

### Official Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [Medusa Docs](https://docs.medusajs.com)

### Community

- Next.js GitHub Discussions
- React Community Discord
- Ant Design GitHub Issues
- TanStack Discord

---

**Last Updated**: December 2024
**Project Version**: 0.0.7

