# TypeScript Types Documentation

## Overview

AdminFront uses comprehensive TypeScript types to ensure type safety throughout the application. All type definitions are located in `src/types/` directory.

**Total Type Files**: 19

---

## Type Files

### account.ts

User account and authentication types:

```typescript
interface IAdminAuth {
  email: string;
  password: string;
}

interface IAdminResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  api_token: string | null;
  metadata: JSON | null;
  permissions?: any;
  phone: string;
}

enum ERole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

enum EPermissions {
  Manager = 'manager',
  Warehouse = 'Warehouse',
  Driver = 'driver',
  Accountant = 'accountant',
}

const rolesEmployee = [
  { label: 'Quản lý', value: EPermissions.Manager },
  { label: 'Nhân viên kho', value: EPermissions.Warehouse },
  { label: 'Tài xế', value: EPermissions.Driver },
  { label: 'Kế toán', value: EPermissions.Accountant },
];

type IUserRequest = {
  email: string;
  fullName: string;
  phone: string;
  permissions: string[];
};
```

---

### common.ts

Common types shared across modules

---

### currencies.ts

Currency-related types and configurations

---

### discount.ts

Discount and promotion types

---

### fulfillments.ts

Order fulfillment types

---

### gift-cards.ts

Gift card types

---

### item-unit.ts

Product unit types

---

### kiot.ts

Kiot portal-specific types:
- Kiot warehouse types
- Kiot order types
- Kiot inventory types

---

### lineItem.ts

Order line item types

---

### order.ts

Complete order types:
- Order structure
- Order status enums
- Payment status enums
- Fulfillment status enums

---

### price.ts

Pricing types:
- Money amounts
- Price lists
- Currency prices

---

### productCategories.ts

Product category types:
- Category structure
- Nested categories
- Category metadata

---

### products.ts

Product types:
- Product structure
- Variant types
- Option types
- Product images
- Product collections

---

### routes.ts

Routing and permissions:

```typescript
enum ERoutes {
  LOGIN = '/login',
  HOME = '/admin',
  ACCOUNTS = '/admin/accounts',
  PRODUCTS = '/admin/products',
  // ... all routes
  KIOT_HOME = '/kiot',
  KIOT_WAREHOUSE_MANAGE = '/kiot/warehouse/manage',
}

interface TRouteConfig {
  path: ERoutes;
  mode: EPermissions[];
}

const routesConfig: TRouteConfig[] = [
  {
    path: ERoutes.PRODUCTS,
    mode: [EPermissions.Manager, EPermissions.Warehouse],
  },
  // ... all route configurations
];
```

---

### shared.ts

Shared utility types

---

### supplier-order.ts

Supplier order types:
- Purchase order structure
- Supplier order status
- Supplier order items

---

### supplier.ts

Supplier types:
- Supplier information
- Supplier contacts
- Supplier metrics

---

### variants.ts

Product variant types:
- Variant structure
- Variant options
- Variant pricing

---

### warehouse.ts

Warehouse types:
- Warehouse structure
- Inventory levels
- Transaction types
- Stock movements

---

## Usage Examples

### Using Types in Components

```typescript
import { Product } from '@/types/products';
import { Order, OrderStatus } from '@/types/order';
import { EPermissions } from '@/types/account';

interface Props {
  product: Product;
  onUpdate: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onUpdate }) => {
  // Component implementation
};
```

### Type Guards

```typescript
import { Order, OrderStatus } from '@/types/order';

function isPaidOrder(order: Order): boolean {
  return order.payment_status === 'captured';
}

function isShippedOrder(order: Order): boolean {
  return order.fulfillment_status === 'shipped';
}
```

### Generic Types

```typescript
type ApiResponse<T> = {
  data: T;
  count?: number;
  limit?: number;
  offset?: number;
};

type ProductResponse = ApiResponse<{ products: Product[] }>;
type OrderResponse = ApiResponse<{ orders: Order[] }>;
```

---

## Best Practices

1. **Always use types** for props, state, and function parameters
2. **Import from type files** instead of defining inline
3. **Use enums** for fixed sets of values
4. **Extend Medusa types** when adding custom fields
5. **Document custom types** with JSDoc comments

---

**Last Updated**: December 2024

