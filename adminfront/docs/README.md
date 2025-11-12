# AdminFront - Complete Documentation

## Overview

**AdminFront** is a comprehensive e-commerce administration platform built with Next.js 14, designed to manage products, orders, customers, inventory, and warehouse operations. The application features two distinct portals:

- **Admin Portal**: Full-featured e-commerce management system
- **Kiot Portal**: Simplified warehouse and inventory management for retail locations

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 14 App Router                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │ Admin Portal │         │ Kiot Portal  │                  │
│  │  /admin/*    │         │   /kiot/*    │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                        │                           │
│         └────────────┬───────────┘                          │
│                      │                                       │
│              ┌───────▼────────┐                             │
│              │  Shared Layer  │                             │
│              ├────────────────┤                             │
│              │  - Components  │                             │
│              │  - Hooks       │                             │
│              │  - Providers   │                             │
│              │  - Services    │                             │
│              │  - Utils       │                             │
│              │  - Types       │                             │
│              └───────┬────────┘                             │
│                      │                                       │
├──────────────────────┼───────────────────────────────────────┤
│                      │                                       │
│              ┌───────▼────────┐                             │
│              │  State Layer   │                             │
│              ├────────────────┤                             │
│              │ TanStack Query │                             │
│              │ (React Query)  │                             │
│              └───────┬────────┘                             │
│                      │                                       │
├──────────────────────┼───────────────────────────────────────┤
│                      │                                       │
│              ┌───────▼────────┐                             │
│              │   Medusa.js    │                             │
│              │  Backend API   │                             │
│              └────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14.1.4 with App Router
- **UI Library**: React 18 + TypeScript 5
- **Component Library**: Ant Design 5.22.4
- **Styling**: Tailwind CSS 3.3.0
- **State Management**: TanStack React Query 4.36.1
- **Backend**: Medusa.js (E-commerce Platform)
- **Form Management**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library, Cypress

For complete tech stack details, see [TECH_STACK.md](./TECH_STACK.md)

## Project Structure

```
adminfront/
├── src/
│   ├── actions/              # Server actions
│   │   ├── accounts.ts
│   │   ├── auth.ts
│   │   ├── common.ts
│   │   ├── images.ts
│   │   ├── productCategories.ts
│   │   └── products.ts
│   │
│   ├── app/                  # Next.js App Router
│   │   ├── (main)/           # Main application routes
│   │   │   ├── admin/        # Admin portal routes
│   │   │   │   ├── accounts/
│   │   │   │   ├── currencies/
│   │   │   │   ├── customers/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── discounts/
│   │   │   │   ├── draft-orders/
│   │   │   │   ├── gift-cards/
│   │   │   │   ├── item-unit/
│   │   │   │   ├── orders/
│   │   │   │   ├── pricing/
│   │   │   │   ├── product-categories/
│   │   │   │   ├── products/
│   │   │   │   ├── regions/
│   │   │   │   ├── return-reasons/
│   │   │   │   ├── supplier-orders/
│   │   │   │   ├── suppliers/
│   │   │   │   ├── warehouse/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   └── kiot/         # Kiot portal routes
│   │   │       ├── accounts/
│   │   │       ├── dashboard/
│   │   │       ├── warehouse/
│   │   │       └── layout.tsx
│   │   │
│   │   ├── login/
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css
│   │
│   ├── components/           # Reusable UI components (30+)
│   │   ├── App/
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   ├── Breadcrumb/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Checkbox/
│   │   ├── Collapse/
│   │   ├── Dropdown/
│   │   ├── Empty/
│   │   ├── Flex/
│   │   ├── Image/
│   │   ├── Input/
│   │   ├── List/
│   │   ├── Modal/
│   │   ├── Pagination/
│   │   ├── Popconfirm/
│   │   ├── Radio/
│   │   ├── Select/
│   │   ├── Skeleton/
│   │   ├── Steps/
│   │   ├── Switch/
│   │   ├── Table/
│   │   ├── Tabs/
│   │   ├── Tag/
│   │   ├── Tooltip/
│   │   ├── Typography/
│   │   └── Upload/
│   │
│   ├── lib/                  # Core library code
│   │   ├── constants/        # Application constants
│   │   │   ├── medusa-backend-url.ts
│   │   │   ├── query-client.ts
│   │   │   └── variables.ts
│   │   │
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── api/          # TanStack Query API hooks (17 categories)
│   │   │   │   ├── customer/
│   │   │   │   ├── draft-orders/
│   │   │   │   ├── fulfullment/
│   │   │   │   ├── item-unit/
│   │   │   │   ├── kiot/
│   │   │   │   ├── line-item/
│   │   │   │   ├── order/
│   │   │   │   ├── product/
│   │   │   │   ├── product-inbound/
│   │   │   │   ├── product-outbound/
│   │   │   │   ├── supplier/
│   │   │   │   ├── supplier-order/
│   │   │   │   ├── supplier-order-edits/
│   │   │   │   ├── uploads/
│   │   │   │   ├── variants/
│   │   │   │   └── warehouse/
│   │   │   │
│   │   │   ├── use-is-me.tsx
│   │   │   ├── use-observe-width.ts
│   │   │   ├── use-toggle-state.tsx
│   │   │   ├── useIsDesktop.tsx
│   │   │   ├── useIsFetching.tsx
│   │   │   └── useScrollDirection.ts
│   │   │
│   │   ├── providers/        # React context providers
│   │   │   ├── feature-flag-provider.tsx
│   │   │   ├── import-refresh.tsx
│   │   │   ├── layer-modal-provider.tsx
│   │   │   ├── medusa-provider.tsx
│   │   │   ├── polling-provider.tsx
│   │   │   ├── product-unit-provider.tsx
│   │   │   ├── stepped-modal-provider.tsx
│   │   │   └── user-provider.tsx
│   │   │
│   │   └── utils.ts          # Utility functions
│   │
│   ├── modules/              # Feature modules
│   │   ├── admin/            # Admin portal modules
│   │   │   ├── account/      # User management (5 components)
│   │   │   ├── common/       # Shared admin components
│   │   │   ├── currencies/   # Currency management (4 components)
│   │   │   ├── customers/    # Customer management (13 components)
│   │   │   ├── dashboard/    # Dashboard overview
│   │   │   ├── discounts/    # Discount system (58 components)
│   │   │   ├── draft-orders/ # Draft order creation (20 components)
│   │   │   ├── gift-card/    # Gift card management (11 components)
│   │   │   ├── item-unit/    # Product units (3 components)
│   │   │   ├── orders/       # Order management (78 components)
│   │   │   ├── pricing/      # Price list management (23 components)
│   │   │   ├── product-categories/  # Category management (4 components)
│   │   │   ├── products/     # Product management (54 components)
│   │   │   ├── regions/      # Regional settings (9 components)
│   │   │   ├── return-reasons/  # Return management (3 components)
│   │   │   ├── supplier-orders/  # Purchase orders (68 components)
│   │   │   ├── suppliers/    # Supplier directory (3 components)
│   │   │   └── warehouse/    # Inventory management (40 components)
│   │   │
│   │   └── kiot/             # Kiot portal modules
│   │       ├── account/      # Kiot user management (5 components)
│   │       ├── common/       # Shared kiot components
│   │       ├── dashboard/    # Kiot dashboard
│   │       └── warehouse/    # Kiot warehouse operations (36 components)
│   │
│   ├── services/             # API service layer
│   │   ├── accounts.ts
│   │   ├── api.js            # Main API service
│   │   ├── products.ts
│   │   └── request.js        # HTTP client
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── account.ts
│   │   ├── common.ts
│   │   ├── currencies.ts
│   │   ├── discount.ts
│   │   ├── fulfillments.ts
│   │   ├── gift-cards.ts
│   │   ├── item-unit.ts
│   │   ├── kiot.ts
│   │   ├── lineItem.ts
│   │   ├── order.ts
│   │   ├── price.ts
│   │   ├── productCategories.ts
│   │   ├── products.ts
│   │   ├── routes.ts
│   │   ├── shared.ts
│   │   ├── supplier-order.ts
│   │   ├── supplier.ts
│   │   ├── variants.ts
│   │   └── warehouse.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── build-options.ts
│   │   ├── countries.ts
│   │   ├── currencies.ts
│   │   ├── fulfillment-providers.mapper.ts
│   │   ├── generate-params.ts
│   │   ├── get-relative-time.ts
│   │   ├── is-line-item.ts
│   │   ├── is-nullish-object.ts
│   │   ├── is-valid-email.ts
│   │   ├── map-address-to-form.ts
│   │   ├── payment-providers-mapper.ts
│   │   ├── prices.ts
│   │   └── remove-nullish.ts
│   │
│   ├── middleware.ts         # Next.js middleware (auth & permissions)
│   └── theme.tsx             # Ant Design theme configuration
│
├── public/                   # Static assets
├── __tests__/                # Test files
├── cypress/                  # E2E tests
├── coverage/                 # Test coverage reports
│
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── jest.config.ts            # Jest configuration
├── cypress.config.ts         # Cypress configuration
├── package.json              # Dependencies
└── Dockerfile                # Docker configuration
```

## Key Features

### Admin Portal

1. **Product Management**
   - Product catalog with variants and options
   - Product categories (nested with drag-and-drop)
   - Collections management
   - Inventory tracking
   - Product images and media

2. **Order Management**
   - Complete order lifecycle
   - Order fulfillment and tracking
   - Returns, swaps, and claims
   - Draft orders
   - Order timeline and history

3. **Customer Management**
   - Customer directory
   - Customer groups
   - Order history per customer
   - Custom pricing per customer

4. **Pricing & Discounts**
   - Price lists for customer groups
   - Dynamic discount rules
   - Gift card management
   - Promotional campaigns

5. **Inventory & Warehouse**
   - Multi-warehouse support
   - Inbound operations (receiving)
   - Outbound operations (picking & packing)
   - Stock level tracking
   - Inventory transactions
   - Shipment management

6. **Supplier Management**
   - Supplier directory
   - Purchase orders (supplier orders)
   - Supplier pricing
   - Order tracking and fulfillment

7. **Settings & Configuration**
   - Regional settings
   - Currency management
   - Shipping methods
   - Payment providers
   - Return reasons
   - User accounts and permissions

### Kiot Portal

Simplified warehouse interface for retail locations:

1. **Warehouse Operations**
   - Inventory management
   - Inbound/Outbound operations
   - Stock checking
   - Transaction history

2. **User Management**
   - Kiot user accounts
   - Permission management

## Authentication & Authorization

The application implements a comprehensive auth system with:

- **JWT-based authentication** (cookie: `_jwt_token_`)
- **Role-based access control** (RBAC)
- **Permission-based routing** via middleware
- **Session management** with Medusa backend

### User Roles & Permissions

```typescript
enum ERole {
  ADMIN,    // Full access to all features
  MEMBER    // Limited access based on permissions
}

enum EPermissions {
  Manager,    // Management operations
  Warehouse,  // Warehouse operations
  Driver,     // Shipping and delivery
  Accountant  // Financial operations
}
```

### Middleware Protection

The `middleware.ts` file enforces:
- Authentication on all protected routes
- Permission checks based on user role
- Environment-based portal access (Admin vs Kiot)
- Automatic redirect to login for unauthorized access

## State Management

### TanStack React Query

The application uses **TanStack React Query v4** for:
- Server state management
- Caching and synchronization
- Automatic refetching
- Optimistic updates
- Background updates

#### Query Keys Factory Pattern

```typescript
import { queryKeysFactory } from 'medusa-react';

const ADMIN_WAREHOUSE = 'admin_warehouse' as const;
export const adminWarehouseKeys = queryKeysFactory(ADMIN_WAREHOUSE);

// Usage
useQuery(
  adminWarehouseKeys.list(query),
  () => client.admin.custom.get(`/admin/warehouse${params}`),
  options
);
```

### Medusa React Integration

The app integrates with Medusa.js through:
- `medusa-react` hooks for standard operations
- Custom API hooks for extended functionality
- `MedusaProvider` wrapping the entire app

## Component Architecture

### Component Categories

1. **UI Components** (30+ reusable components)
   - Wrappers around Ant Design with custom styling
   - Consistent API and behavior
   - TypeScript props with full type safety
   - See [COMPONENTS.md](./COMPONENTS.md)

2. **Feature Components**
   - Domain-specific components in `modules/`
   - Business logic and data fetching
   - Integrated with API hooks

3. **Layout Components**
   - App shell and navigation
   - Header with notifications
   - Sidebar navigation
   - Breadcrumbs

### Component Pattern

```typescript
'use client';
import { ComponentName as AntdComponent, ComponentProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps {
  className?: string;
  // Additional custom props
}

export default function Component({ className, ...props }: Props) {
  return (
    <AntdComponent 
      className={cn('default-classes', className)} 
      {...props}
    />
  );
}
```

## API Integration

### Service Layer

Located in `src/services/`:

- **api.js**: Main API service with all Medusa endpoints
- **request.js**: HTTP client with auth headers
- **accounts.ts**: Account-specific operations
- **products.ts**: Product-specific operations

### Custom Hooks

Located in `src/lib/hooks/api/`:

17 categories of custom hooks for:
- Customer operations
- Order management
- Warehouse operations
- Supplier management
- Product operations
- And more...

See [API_HOOKS.md](./API_HOOKS.md) for complete documentation.

## Styling

### Tailwind CSS

- **Custom configuration** in `tailwind.config.ts`
- **Preflight disabled** to work with Ant Design
- **Custom utilities** with `@/lib/utils` (cn function)
- **Responsive design** with mobile-first approach

### Ant Design Theming

Custom theme in `src/theme.tsx`:
- Brand colors
- Component customization
- Dark mode support (via next-themes)

### Utility Function

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Environment Variables

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000

# Portal mode: 'admin' or 'kiot'
NEXT_PUBLIC_USER_ACCESS_TYPE=admin
```

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn or npm
- Medusa backend running

### Installation

```bash
# Install dependencies
yarn install
# or
npm install
```

### Development

```bash
# Run development server
yarn dev
# or
npm run dev

# Open http://localhost:3000

### Build

```bash
# Build for production
yarn build

# Start production server
yarn start
```

### Docker

```bash
# Build Docker image
docker build -t adminfront .

# Run container
docker run -p 3000:3000 adminfront
```

## Development Workflow

### Adding New Features

1. **Create types** in `src/types/`
2. **Add API hooks** in `src/lib/hooks/api/`
3. **Create UI components** in `src/components/` (if reusable)
4. **Build feature module** in `src/modules/admin/` or `src/modules/kiot/`
5. **Add routes** in `src/app/(main)/admin/` or `src/app/(main)/kiot/`
6. **Update permissions** in `src/types/routes.ts` if needed
7. **Write tests** in `__tests__/` and `cypress/`

### Code Organization Principles

- **Feature-based structure** in `modules/`
- **Reusable components** in `components/`
- **Shared logic** in `lib/`
- **Type safety** throughout with TypeScript
- **Consistent naming** conventions

## Progressive Web App (PWA)

The application is configured as a PWA with:
- Service worker for offline support
- Manifest file for installability
- Runtime caching strategies
- Background sync capabilities

Configuration in `next.config.mjs` using `next-pwa`.

## Documentation Index

- [Tech Stack](./TECH_STACK.md) - Complete technology stack details
- [Components](./COMPONENTS.md) - All reusable UI components
- [API Hooks](./API_HOOKS.md) - TanStack Query hooks documentation
- [Features](./FEATURES.md) - Feature modules documentation
- [Services](./SERVICES.md) - API service layer
- [Types](./TYPES.md) - TypeScript type definitions
- [Utilities](./UTILITIES.md) - Helper functions and utilities
- [Providers](./PROVIDERS.md) - React context providers
- [Custom Hooks](./CUSTOM_HOOKS.md) - Non-API custom hooks

## Changelog

See [CHANGELOG.md](../CHANGELOG.md) for version history and release notes.

## Contributing

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write descriptive commit messages
- Add JSDoc comments for complex functions

### Git Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run linter: `yarn lint`
4. Run tests: `yarn test`
5. Submit pull request

## License

[Specify your license here]

## Support

For questions and support, contact the development team.

---

**Version**: 0.0.7
**Last Updated**: December 2024

