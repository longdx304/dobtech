# Kiot Portal Features Documentation

## Overview

The **Kiot Portal** (`/kiot/*`) is a simplified warehouse management interface designed for retail locations and warehouse staff. It provides focused access to essential inventory and warehouse operations with **3 major modules** comprising **42 components**.

## Purpose

The Kiot Portal is designed for:
- **Warehouse Staff**: Front-line workers managing inventory
- **Store Managers**: Retail location managers
- **Kiot Operators**: Staff at remote retail locations (Kiot = small shop/kiosk in Vietnamese)

## Access Control

**Environment Variable**: `NEXT_PUBLIC_USER_ACCESS_TYPE=kiot`

When set to 'kiot', the middleware restricts access to only `/kiot/*` routes, providing a focused experience for warehouse operations.

**Permissions**: Warehouse, Manager (subset of Admin permissions)

---

# Kiot Portal Modules

## 1. Accounts Management

**Location**: `src/modules/kiot/account/`
**Components**: 5
**Route**: `/kiot/accounts`
**Permissions**: Manager, Accountant

### Features

#### Kiot User Management
- View Kiot users
- Create Kiot user accounts
- Edit user details
- Manage user permissions (Warehouse operations)
- Set user status

### Component Structure

Similar to Admin accounts but simplified:
- **account-list/**: User list view
- **account-modal/**: User creation/edit
- **user-management**: Basic user operations

**Components**: 5 files for Kiot user management

### Key Differences from Admin

- **Simplified permissions**: Only warehouse-related permissions
- **Limited roles**: No admin role creation
- **Focused on operations**: Users can only manage warehouse tasks
- **No system settings**: Cannot modify system configurations

### User Types in Kiot

1. **Kiot Manager**
   - Full access to Kiot portal
   - Create/edit users
   - View all reports
   - Approve transactions

2. **Warehouse Staff**
   - Inbound/outbound operations
   - Stock checking
   - Basic inventory management
   - Cannot manage users

### Functionalities

```typescript
{
  email: string;
  first_name: string;
  last_name: string;
  permissions: 'Warehouse' | 'Manager';
  kiot_location?: string;
}
```

**Operations**:
- Create Kiot user
- Edit user details
- Assign to warehouse
- Deactivate user
- View user activity

---

## 2. Dashboard

**Location**: `src/modules/kiot/dashboard/`
**Components**: 1
**Route**: `/kiot/dashboard` or `/kiot`
**Permissions**: All Kiot users

### Features

#### Kiot Dashboard Overview
- Today's activity summary
- Pending tasks
- Recent transactions
- Quick actions
- Inventory alerts
- Assigned orders

### Components

- **index.tsx**: Main Kiot dashboard view

### Key Metrics

1. **Today's Activity**
   - Inbound shipments received
   - Outbound orders shipped
   - Inventory adjustments made
   - Stock checked items

2. **Pending Tasks**
   - Orders awaiting assignment
   - Pending inbound shipments
   - Pending outbound orders
   - Stock count tasks

3. **Inventory Status**
   - Total SKUs in warehouse
   - Low stock alerts
   - Out of stock items
   - Recent movements

4. **Quick Actions**
   - Receive inbound
   - Pick order
   - Check stock
   - Adjust inventory

### Dashboard Layout

```
┌─────────────────────────────────────────┐
│         Kiot Dashboard                   │
├──────────────┬──────────────┬───────────┤
│  Inbound: 5  │ Outbound: 12 │ Stock: 3  │
│  Pending     │  To Ship     │  Alerts   │
├──────────────┴──────────────┴───────────┤
│  Recent Activity                         │
│  - Received SO-001                       │
│  - Shipped Order #123                    │
│  - Stock adjusted: SKU-456               │
├──────────────────────────────────────────┤
│  Inventory Alerts                        │
│  ⚠️ Low stock: Product A (5 units)      │
│  ⚠️ Out of stock: Product B             │
└──────────────────────────────────────────┘
```

---

## 3. Warehouse Operations

**Location**: `src/modules/kiot/warehouse/`
**Components**: 36 (largest Kiot module)
**Route**: `/kiot/warehouse/*`
**Permissions**: Warehouse, Manager

### Features

Complete warehouse operations system tailored for Kiot staff:
- **Inbound operations**: Receive shipments
- **Outbound operations**: Ship orders
- **Stock checking**: Real-time inventory verification
- **Inventory management**: Basic inventory operations
- **Transaction history**: View all warehouse movements

### Sub-Modules Structure

The Kiot warehouse module mirrors the Admin warehouse but with simplified workflows:

#### Kiot Inbound (`warehouse/inbound/`)
**Route**: `/kiot/warehouse/inbound`
**Components**: ~8

**Features**:
- View assigned inbound shipments
- Scan products
- Confirm receipt
- Report discrepancies
- Update inventory

**Workflow**:
```
1. View assigned inbound orders
2. Select order to receive
3. Scan or manually enter SKUs
4. Enter received quantities
5. Note any issues
6. Confirm receipt
7. System updates inventory
```

**Key Differences from Admin**:
- Only see assigned orders
- Simplified receiving interface
- Barcode scanning optimized
- Mobile-friendly
- Cannot create inbound orders
- Cannot modify supplier orders

#### Kiot Outbound (`warehouse/outbound/`)
**Route**: `/kiot/warehouse/outbound`
**Components**: ~8

**Features**:
- View assigned outbound orders
- Pick orders
- Pack orders
- Print packing slips
- Confirm shipment

**Workflow**:
```
1. View assigned customer orders
2. Select order to pick
3. Pick items (scan to verify)
4. Pack items
5. Print packing slip
6. Confirm shipment
7. Add tracking if available
```

**Key Differences from Admin**:
- Only see assigned orders
- Optimized picking interface
- Cannot edit orders
- Cannot create shipments
- Simplified packing workflow

#### Kiot Manage (`warehouse/manage/`)
**Route**: `/kiot/warehouse/manage`
**Components**: ~8

**Features**:
- View inventory by SKU
- Search products
- View stock levels
- View locations
- Basic inventory info

**Capabilities**:
- Search by SKU/barcode
- View product details
- Check stock levels
- View warehouse locations
- Cannot create products
- Cannot modify product data

#### Kiot Stock Checker (`warehouse/stock-checker/`)
**Route**: `/kiot/warehouse/stock-checker`
**Components**: ~6

**Features**:
- Quick stock lookup
- Real-time availability
- Multi-SKU lookup
- Export stock data
- Low stock alerts

**Use Cases**:
- Customer inquiry (phone/in-person)
- Quick availability check
- Reorder planning
- Stock verification

**Interface**:
```typescript
// Quick search interface
{
  sku: string;
  quantity_available: number;
  quantity_reserved: number;
  location?: string;
  last_updated: Date;
}
```

#### Kiot Transactions (`warehouse/transactions/`)
**Route**: `/kiot/warehouse/transactions`
**Components**: ~3

**Features**:
- View transaction history
- Filter by type
- Export transactions
- Audit trail

**Transaction Types Visible**:
- Inbound receipts
- Outbound shipments
- Stock adjustments
- Transfers

**Cannot See**:
- Financial data
- Cost information
- Supplier details
- Profit margins

#### Kiot Inventory Checker (`warehouse/inventory-checker/`)
**Route**: `/kiot/warehouse/inventory-checker`
**Components**: ~3

**Features**:
- Generate inventory reports
- Check inventory by category
- Export to Excel
- Compare stock levels

**Report Types**:
- Current inventory snapshot
- Low stock report
- Out of stock report
- Movement report (today/this week)

### Component Distribution

```
kiot/warehouse/
├── inbound/
│   ├── components/ (6 files)
│   └── templates/ (2 files)
├── outbound/
│   ├── components/ (5 files)
│   └── templates/ (3 files)
├── manage/
│   ├── components/ (4 files)
│   └── templates/ (4 files)
├── stock-checker/
│   ├── components/ (2 files)
│   └── templates/ (4 files)
├── transactions/
│   ├── components/ (1 file)
│   └── templates/ (1 file)
└── inventory-checker/
    └── templates/ (2 files)
```

### Key Functionalities

#### 1. Barcode Scanning

Kiot portal optimized for barcode scanners:
- USB barcode scanners
- Mobile device cameras
- Quick product lookup
- Fast data entry

```typescript
const handleScan = (barcode: string) => {
  // Look up product by barcode
  const variant = variants.find(v => v.barcode === barcode);
  // Add to current operation
  addToOperation(variant);
};
```

#### 2. Assignment System

Orders are assigned to Kiot users:

```typescript
interface Assignment {
  order_id: string;
  assigned_to: string; // User ID
  assigned_at: Date;
  type: 'inbound' | 'outbound';
  status: 'assigned' | 'in_progress' | 'completed';
}
```

**Workflow**:
1. Admin/Manager assigns order to Kiot user
2. User sees order in their queue
3. User processes order
4. System tracks time and completion
5. Admin can monitor progress

#### 3. Mobile-Optimized Interface

All Kiot interfaces are mobile-friendly:
- Large touch targets
- Minimal scrolling
- Quick actions
- Offline support (PWA)
- Scanner integration

#### 4. Simplified Data Entry

Forms optimized for speed:
- Auto-focus on key fields
- Keyboard shortcuts
- Quick scan entry
- Minimal validation (done at admin level)
- One-click actions

#### 5. Real-time Updates

Kiot portal uses polling for real-time data:
- New assignments appear automatically
- Stock levels update in real-time
- Order status updates
- Notifications for new tasks

### Integration with Admin Portal

```
┌─────────────┐           ┌─────────────┐
│   Admin     │           │    Kiot     │
│   Portal    │           │   Portal    │
└──────┬──────┘           └──────┬──────┘
       │                         │
       │  1. Create Order        │
       │  2. Assign to Kiot User │
       ├────────────────────────>│
       │                         │
       │  3. Process Order       │
       │     (Kiot User)         │
       │                    ┌────┴────┐
       │                    │ Receive │
       │                    │ Pick    │
       │                    │ Pack    │
       │                    │ Ship    │
       │                    └────┬────┘
       │                         │
       │  4. Update Status       │
       │<────────────────────────┤
       │                         │
       │  5. View Completion     │
       │                         │
```

**Data Flow**:
1. Admin creates/assigns work
2. Kiot staff executes work
3. System updates inventory
4. Admin monitors progress
5. Reports generated

---

# Common Components

Shared across Kiot modules:

## 1. Kiot Header

Simplified header with:
- Current warehouse location
- User name
- Pending tasks count
- Quick logout

## 2. Kiot Sidebar

Minimal navigation:
- Dashboard
- Inbound
- Outbound
- Stock Checker
- Manage
- My Account

## 3. Task Queue

Component showing assigned tasks:
```typescript
interface TaskQueue {
  inbound_count: number;
  outbound_count: number;
  adjustments_count: number;
  urgent_count: number;
}
```

## 4. Scanner Input

Specialized input for barcode scanners:
```tsx
<ScannerInput
  onScan={handleScan}
  autoFocus
  placeholder="Scan barcode..."
/>
```

## 5. Quantity Adjuster

Quick quantity input:
```tsx
<QuantityAdjuster
  value={quantity}
  onChange={setQuantity}
  min={0}
  max={available}
/>
```

---

# User Experience

## Design Principles

1. **Simplicity**: Only essential features
2. **Speed**: Optimized for quick operations
3. **Mobile-first**: Works on tablets and phones
4. **Offline-capable**: PWA for spotty connectivity
5. **Error-tolerant**: Graceful error handling

## Typical User Workflows

### Warehouse Receiving Staff

**Morning Routine**:
```
1. Login to Kiot portal
2. Check dashboard for assigned tasks
3. Navigate to Inbound
4. Process each inbound shipment:
   - Open shipment
   - Scan items
   - Confirm quantities
   - Note discrepancies
   - Complete receipt
5. Check for more tasks
6. Take break
7. Repeat
```

### Order Fulfillment Staff

**Daily Operations**:
```
1. Login to Kiot portal
2. View assigned orders (Outbound)
3. For each order:
   - Review items needed
   - Pick items (scan to verify)
   - Pack order
   - Print packing slip
   - Mark as shipped
   - Add tracking number
4. Check for urgent orders
5. Process next order
```

### Stock Manager

**Stock Checking**:
```
1. Receive phone call/email inquiry
2. Open Stock Checker
3. Enter SKU or scan barcode
4. View real-time availability
5. Provide information to customer
6. Note if reorder needed
```

---

# Technical Details

## API Integration

Kiot portal uses specialized API hooks:

```typescript
// From src/lib/hooks/api/kiot/
import {
  useAdminKiotOrders,
  useAssignOrder,
  useUnassignOrder,
} from '@/lib/hooks/api/kiot';
```

## Query Keys

Separate query keys for Kiot data:

```typescript
const adminWarehouseKiotKeys = queryKeysFactory('admin_warehouse_kiot');
```

## Endpoints

Kiot-specific endpoints:

```
GET  /admin/kiot/warehouse
GET  /admin/kiot/warehouse/inventory?sku=SKU
POST /admin/kiot/order/:id/assign
POST /admin/kiot/order/:id/unassign
GET  /admin/kiot/warehouse/manage/sku
```

---

# Performance Optimizations

## 1. Polling Provider

Real-time updates via polling:

```typescript
<PollingProvider interval={30000}>
  {/* Kiot components */}
</PollingProvider>
```

## 2. PWA Support

Offline capability:
- Service worker
- Cache API
- Background sync
- IndexedDB for offline data

## 3. Optimized Queries

```typescript
useQuery(kiotKeys.list(), fetchKiotOrders, {
  staleTime: 60000, // 1 minute
  refetchInterval: 30000, // 30 seconds
});
```

## 4. Lazy Loading

Components loaded on demand:
```typescript
const KiotWarehouse = lazy(() => import('./warehouse'));
```

---

# Security

## Access Control

1. **Middleware Protection**
   - Checks user access type
   - Redirects Admin users away
   - Validates Kiot permissions

2. **API Restrictions**
   - Kiot users cannot access admin endpoints
   - Limited to assigned orders
   - Cannot modify system settings

3. **Data Isolation**
   - Users only see their assigned tasks
   - Cannot view other users' work
   - Warehouse-specific data

## Audit Trail

All Kiot actions logged:
```typescript
{
  user_id: string;
  action: 'inbound_receive' | 'outbound_ship' | 'stock_check';
  timestamp: Date;
  details: Record<string, any>;
}
```

---

# Limitations

Compared to Admin Portal, Kiot users **cannot**:

1. ❌ Create products
2. ❌ Edit product details
3. ❌ Manage customers
4. ❌ Create orders
5. ❌ Set prices
6. ❌ Configure system settings
7. ❌ View financial data
8. ❌ Manage suppliers
9. ❌ Access reports (beyond basic)
10. ❌ Modify user permissions

Kiot users **can**:

1. ✅ Receive inbound shipments
2. ✅ Ship outbound orders
3. ✅ Check stock levels
4. ✅ View inventory
5. ✅ Scan barcodes
6. ✅ Update order status
7. ✅ Add notes
8. ✅ Print documents
9. ✅ View transaction history
10. ✅ Manage their profile

---

# Future Enhancements

Planned features for Kiot Portal:

1. **Inventory Counting**
   - Cycle counting
   - Full inventory counts
   - Variance reports

2. **Returns Processing**
   - Receive customer returns
   - Inspect items
   - Update inventory

3. **Mobile App**
   - Native iOS/Android apps
   - Better scanner integration
   - Offline-first design

4. **Analytics Dashboard**
   - Personal performance metrics
   - Productivity tracking
   - Accuracy rates

5. **Voice Commands**
   - Hands-free operation
   - Voice picking
   - Status updates

---

# Setup & Configuration

## Environment Setup

```bash
# For Kiot portal access
NEXT_PUBLIC_USER_ACCESS_TYPE=kiot

# Backend URL
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
```

## User Creation

1. Admin creates user with Kiot permissions
2. User receives login credentials
3. User accesses `/kiot` route
4. Middleware redirects to Kiot portal
5. User sees Kiot dashboard

## Warehouse Assignment

Users assigned to specific warehouses:

```typescript
{
  user_id: 'user_123',
  warehouse_id: 'wh_456',
  permissions: ['Warehouse'],
  access_type: 'kiot',
}
```

---

# Testing

## Test Scenarios

1. **Inbound Workflow**
   - Assign inbound to user
   - User logs in
   - Receives shipment
   - Verifies inventory updated

2. **Outbound Workflow**
   - Assign order to user
   - User picks items
   - Packs order
   - Confirms shipment
   - Verifies order status

3. **Stock Checking**
   - User searches SKU
   - Views availability
   - Checks multiple SKUs
   - Exports data

## Performance Tests

- Page load times < 2s
- Scanner input response < 100ms
- Query updates < 500ms
- Offline functionality

---

# Summary

The Kiot Portal provides:

- ✅ **3 focused modules**
- ✅ **42 components**
- ✅ Simplified warehouse operations
- ✅ Mobile-optimized interface
- ✅ Barcode scanner integration
- ✅ Real-time updates
- ✅ Task assignment system
- ✅ PWA capabilities
- ✅ Audit trail
- ✅ Performance optimized

**Target Users**: Warehouse staff, store managers, front-line operations

**Philosophy**: Simple, fast, focused on execution rather than planning

---

**Last Updated**: December 2024

**Related Documentation**:
- [Admin Portal Features](./FEATURES.md)
- [API Hooks](./API_HOOKS.md)
- [Components](./COMPONENTS.md)

