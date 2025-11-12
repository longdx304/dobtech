# Permissions & Roles Documentation

## Overview

AdminFront implements a comprehensive **Role-Based Access Control (RBAC)** system that restricts access to features based on user roles and permissions. This document details what each permission level can access and manage.

**Reference**: `src/modules/admin/common/components/header/MenuItem.tsx` (lines 105-110)
**Reference**: `src/types/account.ts`
**Reference**: `src/types/routes.ts`

---

## User Roles

### ERole Enum

```typescript
enum ERole {
  ADMIN = 'admin',    // Full system access
  MEMBER = 'member',  // Permission-based access
}
```

### Admin Role
- **Access**: Complete unrestricted access to all features
- **Bypass**: Bypasses all permission checks
- **Use Case**: System administrators, owners

### Member Role
- **Access**: Based on assigned permissions
- **Restriction**: Can only access features permitted by their permission set
- **Use Case**: Regular staff members

---

## Permission Types

### EPermissions Enum

```typescript
enum EPermissions {
  Manager = 'manager',         // Quản lý (Management)
  Warehouse = 'Warehouse',     // Nhân viên kho (Warehouse Staff)
  Driver = 'driver',           // Tài xế (Driver)
  Accountant = 'accountant',   // Kế toán (Accountant)
}
```

---

## Permission Matrix

### 1. Manager (Quản lý)

**Description**: Management-level access to business operations

#### ✅ Full Access To:

**Products & Catalog**
- `/admin/products` - View, create, edit, delete products
- `/admin/product-categories` - Manage category hierarchy
- `/admin/collections` - Manage product collections
- View all product variants and options
- Manage product images and media
- Set product prices
- Control product status (published/draft)

**Customers & Sales**
- `/admin/customers` - Full customer management
- `/admin/customer-groups` - Create and manage customer groups
- `/admin/pricing` - Price list management for customer groups
- `/admin/orders` - View and manage all orders
- Process refunds and returns
- Handle swaps and claims
- View customer order history

**Discounts & Promotions**
- `/admin/discounts` - Create complex discount rules
- Manage discount conditions
- Set usage limits
- Schedule promotions
- Apply discounts to specific groups

**Gift Cards**
- `/admin/gift-cards` - Create and manage gift cards
- Set denominations
- Track usage
- Deactivate cards

**Settings & Configuration**
- `/admin/regions` - Regional configuration
- `/admin/currencies` - Currency management
- `/admin/return-reasons` - Return reason management
- Shipping method configuration
- Payment provider setup
- Tax rate configuration

**User Management**
- `/admin/accounts` - Create, edit, delete user accounts
- Assign permissions to users
- Manage user roles
- View user activity

**Warehouse Operations**
- `/admin/warehouse/inbound` - View inbound shipments
- `/admin/warehouse/outbound` - View outbound orders
- `/admin/warehouse/manage` - Warehouse management
- `/admin/warehouse/transactions` - Transaction history
- `/admin/warehouse/stock-checker` - Stock checking
- `/admin/warehouse/shipment` - Shipment tracking
- `/admin/warehouse/inventory-checker` - Inventory reports

**Supplier Management**
- `/admin/suppliers` - Supplier directory management
- `/admin/supplier-orders` - Create and manage purchase orders
- View supplier pricing
- Track supplier performance
- Manage supplier payments

**Draft Orders**
- `/admin/draft-orders` - Create orders for customers
- Apply custom pricing
- Manual discount application

#### ⚠️ Limitations:
- None - Manager has access to all admin features

---

### 2. Warehouse (Nhân viên kho)

**Description**: Warehouse and inventory operations

#### ✅ Full Access To:

**Warehouse Operations**
- `/admin/warehouse/inbound` - Receive supplier shipments
  - Scan products
  - Verify quantities
  - Confirm receipt
  - Update inventory
  
- `/admin/warehouse/outbound` - Process customer orders
  - Pick items
  - Pack orders
  - Print packing slips
  - Create shipments
  
- `/admin/warehouse/transactions` - View inventory movements
  - Inbound records
  - Outbound records
  - Adjustments
  
- `/admin/warehouse/stock-checker` - Real-time stock checking
  - Quick SKU lookup
  - Check availability
  - View locations
  
- `/admin/warehouse/manage` - Basic warehouse management
  - View inventory
  - Search products
  - Check stock levels

**Limited Product Access**
- `/admin/products` - **View only**
  - View product details
  - View variants
  - Check stock levels
  - Cannot create/edit/delete products

**Item Units**
- `/admin/item-unit` - Manage product units
  - Create units
  - Edit units
  - View conversions

**Kiot Portal** (if configured)
- `/kiot/warehouse/*` - All Kiot warehouse operations
  - Manage Kiot inventory
  - Process Kiot orders
  - Stock checking for retail locations

#### ❌ No Access To:
- Customer management
- Order creation/editing
- Pricing and discounts
- Gift cards
- Settings and configuration
- User management
- Supplier management (viewing only)
- Financial operations

#### 🔍 Special Capabilities:
- Assign to specific warehouses
- Track performance metrics
- Barcode scanning
- Inventory adjustments (with approval)

---

### 3. Driver (Tài xế)

**Description**: Delivery and shipment operations

#### ✅ Full Access To:

**Shipment Management**
- `/admin/warehouse/shipment` - Shipment operations
  - View assigned shipments
  - Update delivery status
  - Add tracking numbers
  - Confirm deliveries
  - Upload delivery photos (if configured)

**Warehouse Management**
- `/admin/warehouse/manage` - Limited warehouse access
  - View inventory for shipments
  - Check product details
  - Verify order items

**Inventory Checker**
- `/admin/warehouse/inventory-checker` - Verify inventory
  - Check stock before pickup
  - Confirm availability
  - Report discrepancies

**Limited Product Access**
- `/admin/products` - **View only**
  - View products for delivery
  - Check product details
  - Cannot modify

#### ⚠️ Limited Access To:
- **Dashboard**: Can view but limited data
- **Orders**: Can view assigned orders only
- **Warehouse**: Can only access shipment-related features

#### ❌ No Access To:
- Customer management
- Product creation/editing
- Pricing and discounts
- Settings
- User management
- Supplier management
- Gift cards
- Warehouse inbound/outbound (not assigned to them)

#### 🔍 Special Capabilities:
- Mobile-optimized interface
- GPS tracking (if implemented)
- Digital signature collection (if implemented)
- Route optimization (if implemented)

---

### 4. Accountant (Kế toán)

**Description**: Financial and supplier operations

#### ✅ Full Access To:

**Supplier Management**
- `/admin/suppliers` - Full supplier management
  - Create suppliers
  - Edit supplier details
  - View supplier history
  - Manage supplier contacts
  - Track supplier performance

**Supplier Orders (Purchase Orders)**
- `/admin/supplier-orders` - Complete PO management
  - Create purchase orders
  - Submit to suppliers
  - Track order status
  - Process payments
  - Receive shipments
  - Handle supplier invoices
  - Manage payment schedules
  - Process supplier returns

**Financial Operations**
- View order payment status
- Process supplier payments
- Track outstanding balances
- Generate payment reports
- View financial summaries

**Limited Access**
- `/admin/products` - **View only**
  - View products
  - View pricing
  - Check supplier costs
  - Cannot modify
  
- `/admin/dashboard` - View financial metrics
  - Revenue data
  - Payment status
  - Supplier spending

**Kiot Accounts** (if configured)
- `/kiot/accounts` - Manage Kiot user accounts
  - Create Kiot users
  - Assign permissions
  - View activity

#### ❌ No Access To:
- Customer management
- Product creation/editing
- Order fulfillment
- Warehouse operations (except receiving related to POs)
- Marketing and promotions
- Gift cards
- System settings

#### 🔍 Special Capabilities:
- Payment tracking
- Invoice management
- Supplier analytics
- Cost reporting
- Budget monitoring (if implemented)

---

## Feature Access Summary Table

| Feature | Manager | Warehouse | Driver | Accountant | Admin |
|---------|---------|-----------|--------|------------|-------|
| **Dashboard** | ✅ Full | ✅ Limited | ✅ Limited | ✅ Limited | ✅ Full |
| **Products** | ✅ Full | 👁️ View | 👁️ View | 👁️ View | ✅ Full |
| **Categories** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Collections** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Customers** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Orders** | ✅ Full | ❌ | 👁️ Assigned | ❌ | ✅ Full |
| **Draft Orders** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Discounts** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Gift Cards** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Pricing** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Regions** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Currencies** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Return Reasons** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Item Units** | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full |
| **Suppliers** | ✅ Full | ❌ | ❌ | ✅ Full | ✅ Full |
| **Supplier Orders** | ✅ Full | ❌ | ❌ | ✅ Full | ✅ Full |
| **Warehouse Inbound** | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full |
| **Warehouse Outbound** | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full |
| **Warehouse Manage** | ✅ Full | ✅ Full | ✅ Limited | ❌ | ✅ Full |
| **Warehouse Shipment** | ✅ Full | ❌ | ✅ Full | ❌ | ✅ Full |
| **Stock Checker** | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full |
| **Inventory Checker** | ✅ Full | ✅ Full | ✅ Limited | ❌ | ✅ Full |
| **Transactions** | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full |
| **User Accounts** | ✅ Full | ❌ | ❌ | ❌ | ✅ Full |
| **Kiot Portal** | ✅ Full | ✅ Full | ❌ | ✅ Limited | ✅ Full |

**Legend**:
- ✅ Full: Complete access with all operations
- 👁️ View: Read-only access
- ⚠️ Limited: Restricted access with specific permissions
- ❌ No access

---

## Route Configuration

**Reference**: `src/types/routes.ts` - `routesConfig` array

```typescript
const routesConfig: TRouteConfig[] = [
  // Manager routes
  {
    path: ERoutes.PRODUCTS,
    mode: [EPermissions.Manager, EPermissions.Driver, EPermissions.Accountant, EPermissions.Warehouse],
  },
  {
    path: ERoutes.CUSTOMERS,
    mode: [EPermissions.Manager],
  },
  {
    path: ERoutes.DISCOUNTS,
    mode: [EPermissions.Manager],
  },
  
  // Warehouse routes
  {
    path: ERoutes.WAREHOUSE_INBOUND,
    mode: [EPermissions.Warehouse, EPermissions.Manager],
  },
  {
    path: ERoutes.WAREHOUSE_OUTBOUND,
    mode: [EPermissions.Warehouse, EPermissions.Manager],
  },
  
  // Driver routes
  {
    path: ERoutes.WAREHOUSE_SHIPMENT,
    mode: [EPermissions.Driver, EPermissions.Manager],
  },
  
  // Accountant routes
  {
    path: ERoutes.SUPPLIERS,
    mode: [EPermissions.Manager, EPermissions.Accountant],
  },
  {
    path: ERoutes.SUPPLIER_ORDERS,
    mode: [EPermissions.Manager, EPermissions.Accountant],
  },
];
```

---

## Middleware Protection

**Reference**: `src/middleware.ts`

The middleware checks:
1. **Authentication**: User must be logged in
2. **Role Check**: Admin users bypass permission checks
3. **Permission Check**: Member users must have required permissions
4. **Portal Access**: Environment variable controls Admin vs Kiot access

```typescript
// Middleware flow
if (role === ERole.ADMIN) {
  return NextResponse.next(); // Full access
}

// Check route permissions
if (!hasRoutePermissions(pathname, permissions)) {
  return createRedirect(request, getRedirectPath());
}
```

---

## Permission Assignment

### Creating Users with Permissions

```typescript
// Example: Create warehouse user
const warehouseUser = {
  email: 'warehouse@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: ERole.MEMBER,
  permissions: EPermissions.Warehouse, // Single permission
};

// Example: Create user with multiple permissions
const multiPermissionUser = {
  email: 'staff@example.com',
  first_name: 'Jane',
  last_name: 'Smith',
  role: ERole.MEMBER,
  permissions: [
    EPermissions.Warehouse,
    EPermissions.Driver
  ].join(','), // Comma-separated string
};
```

### Checking Permissions in Code

```typescript
import { useUser } from '@/lib/providers/user-provider';
import { EPermissions, ERole } from '@/types/account';

const MyComponent = () => {
  const { user } = useUser();
  
  // Check if admin
  const isAdmin = user?.role === ERole.ADMIN;
  
  // Check for specific permission
  const hasManagerPermission = user?.permissions?.includes(EPermissions.Manager);
  
  // Check for any of multiple permissions
  const canAccessWarehouse = user?.permissions?.includes(EPermissions.Warehouse) || 
                             user?.permissions?.includes(EPermissions.Manager);
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {hasManagerPermission && <ManagerTools />}
      {canAccessWarehouse && <WarehouseAccess />}
    </div>
  );
};
```

---

## Use Cases & Workflows

### 1. Warehouse Staff Daily Workflow

```
Morning:
1. Login → Redirected to /admin/warehouse/inbound
2. Check assigned inbound shipments
3. Receive and scan products
4. Update inventory
5. Move to outbound operations
6. Pick and pack customer orders
7. Confirm shipments

Access: Warehouse permission only
```

### 2. Driver Daily Workflow

```
Morning:
1. Login → View assigned deliveries
2. Navigate to /admin/warehouse/shipment
3. View shipment details
4. Start delivery route
5. Update delivery status
6. Confirm deliveries
7. Upload proof of delivery

Access: Driver permission only
```

### 3. Accountant Daily Workflow

```
Morning:
1. Login → Check pending supplier payments
2. Navigate to /admin/supplier-orders
3. Review purchase orders
4. Process payments
5. Reconcile supplier invoices
6. Generate financial reports
7. Track outstanding balances

Access: Accountant permission only
```

### 4. Manager Daily Workflow

```
Morning:
1. Login → View dashboard
2. Check sales metrics
3. Review pending orders
4. Manage customer inquiries
5. Create promotions
6. Monitor inventory levels
7. Review reports
8. Manage team access

Access: Manager permission (full access)
```

---

## Security Best Practices

### 1. Principle of Least Privilege
- Assign only necessary permissions
- Regularly review user permissions
- Remove access when role changes

### 2. Permission Auditing
- Track permission changes
- Log access attempts
- Monitor unauthorized access

### 3. Session Management
- JWT tokens with expiration
- Automatic logout on inactivity
- Secure cookie handling

### 4. Multi-Factor Authentication (Future)
- SMS verification
- Email confirmation
- Authenticator apps

---

## Frequently Asked Questions

### Q: Can a user have multiple permissions?
**A**: Yes, permissions are comma-separated in the database. A user can be both Warehouse and Driver, for example.

### Q: What's the difference between Admin and Manager?
**A**: Admin is a system role with unrestricted access that bypasses all permission checks. Manager is a permission level with full access to business features but can be restricted if needed.

### Q: Can I create custom permissions?
**A**: The current system uses predefined permissions. Custom permissions would require modifying the `EPermissions` enum and updating route configurations.

### Q: How do I restrict a Manager from certain features?
**A**: Currently, Manager permission grants full access. To restrict, you would need to either:
1. Create a new permission level
2. Modify the route configuration
3. Use custom permission checks in components

### Q: Can Warehouse staff view financial data?
**A**: No, financial data is restricted to Manager and Accountant permissions only.

### Q: Can Driver create orders?
**A**: No, Driver can only view assigned orders and manage shipments. Order creation requires Manager permission.

---

## Migration Guide

### Adding New Permission

1. **Add to EPermissions enum** (`src/types/account.ts`):
```typescript
enum EPermissions {
  Manager = 'manager',
  Warehouse = 'Warehouse',
  Driver = 'driver',
  Accountant = 'accountant',
  NewRole = 'new_role', // Add new permission
}
```

2. **Update rolesEmployee array**:
```typescript
export const rolesEmployee = [
  // ... existing roles
  { label: 'New Role Label', value: EPermissions.NewRole },
];
```

3. **Configure routes** (`src/types/routes.ts`):
```typescript
{
  path: ERoutes.NEW_FEATURE,
  mode: [EPermissions.NewRole, EPermissions.Manager],
}
```

4. **Update middleware** if needed

5. **Add to documentation**

---

## Summary

AdminFront's permission system provides:

✅ **4 permission levels** (Manager, Warehouse, Driver, Accountant)
✅ **2 role types** (Admin, Member)
✅ **Flexible access control** via route configuration
✅ **Middleware protection** for all routes
✅ **Type-safe permissions** with TypeScript enums
✅ **Granular access control** for different workflows
✅ **Scalable architecture** for adding new permissions

Each permission is designed for specific business workflows while maintaining security and separation of concerns.

---

**Last Updated**: December 2024
**Version**: 0.0.7

**Related Documentation**:
- [Features](./FEATURES.md) - Complete feature list
- [Routes](./routes.ts) - Route configuration
- [Middleware](../src/middleware.ts) - Authentication logic

