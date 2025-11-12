# API Hooks Documentation

## Overview

AdminFront uses **TanStack React Query** (v4.36.1) for server state management. The application includes **17 categories** of custom API hooks organized in `src/lib/hooks/api/`, providing type-safe interfaces to the Medusa backend API.

## Architecture

### Hook Structure

```
src/lib/hooks/api/
├── customer/           # Customer management
├── draft-orders/       # Draft order operations
├── fulfullment/        # Order fulfillment
├── item-unit/          # Product unit management
├── kiot/               # Kiot portal operations
├── line-item/          # Order line items
├── order/              # Order management
├── product/            # Product operations
├── product-inbound/    # Warehouse receiving
├── product-outbound/   # Warehouse shipping
├── supplier/           # Supplier management
├── supplier-order/     # Purchase orders
├── supplier-order-edits/ # Purchase order edits
├── uploads/            # File uploads
├── variants/           # Product variants
└── warehouse/          # Warehouse operations
```

### Query Keys Factory Pattern

All hooks use the `queryKeysFactory` from `medusa-react` for consistent cache key generation:

```typescript
import { queryKeysFactory } from 'medusa-react';

const HOOK_NAME = 'admin_hook_name' as const;
export const hookKeys = queryKeysFactory(HOOK_NAME);

// Generated keys:
// - hookKeys.all()
// - hookKeys.lists()
// - hookKeys.list(query)
// - hookKeys.details()
// - hookKeys.detail(id)
```

### buildOptions Utility

Mutations use the `buildOptions` utility for automatic cache invalidation:

```typescript
import { buildOptions } from '@/utils/build-options';

return useMutation(
  mutationFn,
  buildOptions(
    queryClient,
    [hookKeys.lists(), hookKeys.details()], // Keys to invalidate
    options
  )
);
```

---

## Customer Hooks

**Location**: `src/lib/hooks/api/customer/`

### Mutations

#### useCustomerMutation

**Purpose**: Create, update, or delete customers

**Files**: `mutations.ts`, `index.ts`

**Usage**:
```typescript
import { useCustomerMutation } from '@/lib/hooks/api/customer';

const { mutate, isLoading } = useCustomerMutation({
  onSuccess: (data) => {
    console.log('Customer updated:', data);
  },
});

// Update customer
mutate({
  customerId: 'cust_123',
  data: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
  },
});
```

---

## Draft Orders Hooks

**Location**: `src/lib/hooks/api/draft-orders/`

### Mutations

#### useDraftOrderMutations

**Purpose**: Manage draft orders (create, update, delete, transfer to order)

**Files**: `mutations.ts`, `index.ts`

**Usage**:
```typescript
import { useDraftOrderMutations } from '@/lib/hooks/api/draft-orders';

const { 
  createDraftOrder,
  updateDraftOrder,
  deleteDraftOrder,
  transferToOrder 
} = useDraftOrderMutations();

// Create draft order
createDraftOrder.mutate({
  email: 'customer@example.com',
  items: [{ variant_id: 'var_123', quantity: 2 }],
  region_id: 'reg_123',
  shipping_methods: [{ option_id: 'so_123' }],
});

// Transfer to order
transferToOrder.mutate({ draftOrderId: 'draft_123' });
```

---

## Fulfillment Hooks

**Location**: `src/lib/hooks/api/fulfullment/`

### Queries

#### useAdminFulfillments

**Purpose**: Fetch fulfillment list with filters

**Parameters**:
- `query`: Filter and pagination params
- `options`: React Query options

**Returns**: Fulfillments list with pagination

**Usage**:
```typescript
import { useAdminFulfillments } from '@/lib/hooks/api/fulfullment';

const { fulfillments, isLoading, count } = useAdminFulfillments({
  limit: 20,
  offset: 0,
  order_id: 'order_123',
});
```

### Mutations

#### useCreateFulfillment

**Purpose**: Create order fulfillment

**Usage**:
```typescript
import { useCreateFulfillment } from '@/lib/hooks/api/fulfullment';

const { mutate, isLoading } = useCreateFulfillment('order_123', {
  onSuccess: () => {
    console.log('Fulfillment created');
  },
});

mutate({
  items: [
    { item_id: 'item_123', quantity: 2 }
  ],
  no_notification: false,
});
```

#### useCancelFulfillment

**Purpose**: Cancel existing fulfillment

**Usage**:
```typescript
import { useCancelFulfillment } from '@/lib/hooks/api/fulfullment';

const { mutate } = useCancelFulfillment('order_123');

mutate({ fulfillmentId: 'ful_123' });
```

---

## Item Unit Hooks

**Location**: `src/lib/hooks/api/item-unit/`

### Queries

#### useAdminItemUnits

**Purpose**: Get list of product units

**Usage**:
```typescript
import { useAdminItemUnits } from '@/lib/hooks/api/item-unit';

const { item_units, isLoading } = useAdminItemUnits({
  limit: 50,
  offset: 0,
});
```

#### useAdminItemUnit

**Purpose**: Get single item unit by ID

**Usage**:
```typescript
import { useAdminItemUnit } from '@/lib/hooks/api/item-unit';

const { item_unit, isLoading } = useAdminItemUnit('unit_123');
```

### Mutations

#### useAdminCreateItemUnit

**Purpose**: Create new item unit

**Usage**:
```typescript
import { useAdminCreateItemUnit } from '@/lib/hooks/api/item-unit';

const { mutate } = useAdminCreateItemUnit();

mutate({
  name: 'Box',
  description: 'Standard box unit',
});
```

#### useAdminUpdateItemUnit

**Purpose**: Update existing item unit

**Usage**:
```typescript
import { useAdminUpdateItemUnit } from '@/lib/hooks/api/item-unit';

const { mutate } = useAdminUpdateItemUnit('unit_123');

mutate({
  name: 'Large Box',
  description: 'Updated description',
});
```

#### useAdminDeleteItemUnit

**Purpose**: Delete item unit

**Usage**:
```typescript
import { useAdminDeleteItemUnit } from '@/lib/hooks/api/item-unit';

const { mutate } = useAdminDeleteItemUnit();

mutate({ id: 'unit_123' });
```

---

## Kiot Hooks

**Location**: `src/lib/hooks/api/kiot/`

### Queries

#### useAdminKiotOrders

**Purpose**: Get Kiot orders list

**Parameters**:
```typescript
type KiotOrderQueryParams = {
  limit?: number;
  offset?: number;
  status?: string;
  type?: 'inbound' | 'outbound';
};
```

**Usage**:
```typescript
import { useAdminKiotOrders } from '@/lib/hooks/api/kiot';

const { orders, isLoading, count } = useAdminKiotOrders({
  type: 'inbound',
  status: 'pending',
  limit: 20,
});
```

### Mutations

#### useKiotOrderMutations

**Purpose**: Manage Kiot orders

**Available mutations**:
- `assignOrder`: Assign order to handler
- `unassignOrder`: Remove handler assignment
- `confirmOrder`: Confirm order completion

**Usage**:
```typescript
import { useKiotOrderMutations } from '@/lib/hooks/api/kiot';

const { assignOrder } = useKiotOrderMutations();

assignOrder.mutate({
  orderId: 'order_123',
  handlerId: 'user_456',
});
```

---

## Line Item Hooks

**Location**: `src/lib/hooks/api/line-item/`

### Queries

#### useAdminLineItems

**Purpose**: Get line items for an order

**Usage**:
```typescript
import { useAdminLineItems } from '@/lib/hooks/api/line-item';

const { lineItems, isLoading } = useAdminLineItems({
  order_id: 'order_123',
});
```

---

## Order Hooks

**Location**: `src/lib/hooks/api/order/`

### Mutations

#### useAdminAssignOrder

**Purpose**: Assign order to a handler (warehouse/driver)

**Type**:
```typescript
interface AdminPostOrderAssignReq {
  handler_id: string;
}

interface AdminOrderAsignRes {
  success: boolean;
}
```

**Usage**:
```typescript
import { useAdminAsignOrder } from '@/lib/hooks/api/order';

const { mutate, isLoading } = useAdminAsignOrder('order_123', {
  onSuccess: (data) => {
    console.log('Order assigned:', data.success);
  },
});

mutate({
  handler_id: 'user_456',
});
```

---

## Product Hooks

**Location**: `src/lib/hooks/api/product/`

### Mutations

#### useCheckInventory

**Purpose**: Check and export inventory report for admin

**Type**:
```typescript
type InventoryCheckResponse = {
  fileKey: string;
  fileSize: number;
  downloadUrl: string;
};
```

**Usage**:
```typescript
import { useCheckInventory } from '@/lib/hooks/api/product';

const { mutate, isLoading } = useCheckInventory({
  onSuccess: (data) => {
    window.open(data.downloadUrl, '_blank');
  },
});

mutate({
  filterable_fields: {
    category_id: 'cat_123',
    status: 'published',
  },
});
```

#### useCheckInventoryKiot

**Purpose**: Check inventory for Kiot portal

**Usage**:
```typescript
import { useCheckInventoryKiot } from '@/lib/hooks/api/product';

const { mutate } = useCheckInventoryKiot();

mutate({
  filterable_fields: {
    warehouse_id: 'wh_123',
  },
});
```

---

## Product Inbound Hooks

**Location**: `src/lib/hooks/api/product-inbound/`

### Queries

#### useAdminProductInbounds

**Purpose**: Get list of inbound shipments (receiving)

**Query Params**:
```typescript
type ProductInboundQueryParams = {
  q?: string;
  offset?: number;
  limit?: number;
  status?: 'pending' | 'assigned' | 'confirmed';
  supplier_id?: string;
};
```

**Usage**:
```typescript
import { useAdminProductInbounds } from '@/lib/hooks/api/product-inbound';

const { inbounds, isLoading, count } = useAdminProductInbounds({
  status: 'pending',
  limit: 20,
  offset: 0,
});
```

#### useAdminProductInbound

**Purpose**: Get single inbound by ID

**Usage**:
```typescript
import { useAdminProductInbound } from '@/lib/hooks/api/product-inbound';

const { inbound, isLoading } = useAdminProductInbound('inbound_123');
```

### Mutations

#### useAdminProductInboundHandler

**Purpose**: Assign handler to inbound shipment

**Usage**:
```typescript
import { useAdminProductInboundHandler } from '@/lib/hooks/api/product-inbound';

const { mutate } = useAdminProductInboundHandler();

mutate({ id: 'inbound_123' });
```

#### useAdminProductInboundRemoveHandler

**Purpose**: Remove handler assignment

**Usage**:
```typescript
import { useAdminProductInboundRemoveHandler } from '@/lib/hooks/api/product-inbound';

const { mutate } = useAdminProductInboundRemoveHandler();

mutate({ id: 'inbound_123' });
```

#### useAdminProductInboundConfirmById

**Purpose**: Confirm inbound shipment received

**Type**:
```typescript
type AdminProductInboundConfirmRes = {
  supplierOrder: SupplierOrder;
  message: string;
};
```

**Usage**:
```typescript
import { useAdminProductInboundConfirmById } from '@/lib/hooks/api/product-inbound';

const { mutate, isLoading } = useAdminProductInboundConfirmById('inbound_123', {
  onSuccess: (data) => {
    console.log(data.message);
  },
});

mutate(); // No payload required
```

#### useAdminCreateWarehouseAndInventory

**Purpose**: Create warehouse record and update inventory

**Type**:
```typescript
interface AdminPostWarehouseVariantReq1 {
  variant_id: string;
  quantity: number;
  warehouse_id: string;
  unit_cost?: number;
}
```

**Usage**:
```typescript
import { useAdminCreateWarehouseAndInventory } from '@/lib/hooks/api/product-inbound';

const { mutate } = useAdminCreateWarehouseAndInventory();

mutate({
  variant_id: 'var_123',
  quantity: 100,
  warehouse_id: 'wh_456',
  unit_cost: 1500,
});
```

#### useAssignOrder

**Purpose**: Assign order to Kiot handler

**Type**:
```typescript
type OrderKiotType = 'inbound' | 'outbound';
```

**Usage**:
```typescript
import { useAssignOrder } from '@/lib/hooks/api/product-inbound';

const { mutate } = useAssignOrder();

mutate({
  id: 'order_123',
  type: 'inbound',
});
```

#### useUnassignOrder

**Purpose**: Remove Kiot order assignment

**Usage**:
```typescript
import { useUnassignOrder } from '@/lib/hooks/api/product-inbound';

const { mutate } = useUnassignOrder();

mutate({ id: 'order_123' });
```

---

## Product Outbound Hooks

**Location**: `src/lib/hooks/api/product-outbound/`

### Queries

#### useAdminProductOutbounds

**Purpose**: Get list of outbound shipments (shipping)

**Query Params**:
```typescript
type ProductOutboundQueryParams = {
  q?: string;
  offset?: number;
  limit?: number;
  status?: 'pending' | 'assigned' | 'confirmed' | 'shipped';
  order_id?: string;
};
```

**Usage**:
```typescript
import { useAdminProductOutbounds } from '@/lib/hooks/api/product-outbound';

const { outbounds, isLoading, count } = useAdminProductOutbounds({
  status: 'pending',
  limit: 20,
});
```

#### useAdminProductOutbound

**Purpose**: Get single outbound by ID

**Usage**:
```typescript
import { useAdminProductOutbound } from '@/lib/hooks/api/product-outbound';

const { outbound, isLoading } = useAdminProductOutbound('outbound_123');
```

### Mutations

#### useAdminProductOutboundHandler

**Purpose**: Assign handler to outbound shipment

**Usage**:
```typescript
import { useAdminProductOutboundHandler } from '@/lib/hooks/api/product-outbound';

const { mutate } = useAdminProductOutboundHandler();

mutate({ id: 'outbound_123' });
```

#### useAdminProductOutboundConfirm

**Purpose**: Confirm outbound shipment completed

**Usage**:
```typescript
import { useAdminProductOutboundConfirm } from '@/lib/hooks/api/product-outbound';

const { mutate } = useAdminProductOutboundConfirm('outbound_123');

mutate({
  tracking_number: 'TRK123456',
  carrier: 'DHL',
});
```

---

## Supplier Hooks

**Location**: `src/lib/hooks/api/supplier/`

### Queries

#### useAdminSuppliers

**Purpose**: Get suppliers list

**Query Params**:
```typescript
type SupplierQueryKeyParams = {
  q?: string;
  offset?: number;
  limit?: number;
};
```

**Usage**:
```typescript
import { useAdminSuppliers } from '@/lib/hooks/api/supplier';

const { suppliers, isLoading, count } = useAdminSuppliers({
  q: 'search term',
  limit: 20,
  offset: 0,
});
```

#### useAdminSupplier

**Purpose**: Get single supplier by ID

**Usage**:
```typescript
import { useAdminSupplier } from '@/lib/hooks/api/supplier';

const { supplier, isLoading } = useAdminSupplier('sup_123');
```

### Mutations

#### useSupplierMutations

**Purpose**: Create, update, delete suppliers

**Usage**:
```typescript
import { useSupplierMutations } from '@/lib/hooks/api/supplier';

const { createSupplier, updateSupplier, deleteSupplier } = useSupplierMutations();

// Create
createSupplier.mutate({
  name: 'Supplier Name',
  email: 'supplier@example.com',
  phone: '+1234567890',
  address: 'Address',
});

// Update
updateSupplier.mutate({
  id: 'sup_123',
  data: { name: 'Updated Name' },
});

// Delete
deleteSupplier.mutate({ id: 'sup_123' });
```

---

## Supplier Order Hooks

**Location**: `src/lib/hooks/api/supplier-order/`

### Queries

#### useAdminSupplierOrders

**Purpose**: Get supplier orders (purchase orders) list

**Query Params**:
```typescript
type SupplierOrderQueryKeyParams = {
  q?: string;
  offset?: number;
  limit?: number;
  status?: 'pending' | 'confirmed' | 'received' | 'cancelled';
  fulfillment_status?: 'not_fulfilled' | 'fulfilled' | 'partially_fulfilled';
};
```

**Usage**:
```typescript
import { useAdminSupplierOrders } from '@/lib/hooks/api/supplier-order';

const { supplier_orders, isLoading, count } = useAdminSupplierOrders({
  status: 'pending',
  limit: 20,
  offset: 0,
});
```

#### useAdminSupplierOrder

**Purpose**: Get single supplier order by ID

**Usage**:
```typescript
import { useAdminSupplierOrder } from '@/lib/hooks/api/supplier-order';

const { supplier_order, isLoading } = useAdminSupplierOrder('so_123');
```

### Mutations

#### useSupplierOrderMutations

**Purpose**: Manage supplier orders

**Available mutations**:
- `createSupplierOrder`: Create new purchase order
- `updateSupplierOrder`: Update order details
- `cancelSupplierOrder`: Cancel order
- `confirmSupplierOrder`: Confirm order with supplier
- `receiveSupplierOrder`: Mark order as received

**Usage**:
```typescript
import { useSupplierOrderMutations } from '@/lib/hooks/api/supplier-order';

const { createSupplierOrder, confirmSupplierOrder } = useSupplierOrderMutations();

// Create
createSupplierOrder.mutate({
  supplier_id: 'sup_123',
  items: [
    { variant_id: 'var_456', quantity: 100, unit_price: 1500 }
  ],
  expected_delivery_date: '2024-12-31',
});

// Confirm
confirmSupplierOrder.mutate({ id: 'so_123' });
```

---

## Supplier Order Edits Hooks

**Location**: `src/lib/hooks/api/supplier-order-edits/`

### Queries

#### useAdminSupplierOrderEdits

**Purpose**: Get list of order edit requests

**Usage**:
```typescript
import { useAdminSupplierOrderEdits } from '@/lib/hooks/api/supplier-order-edits';

const { edits, isLoading } = useAdminSupplierOrderEdits({
  supplier_order_id: 'so_123',
});
```

### Mutations

#### useSupplierOrderEditMutations

**Purpose**: Manage supplier order edits

**Available mutations**:
- `createEdit`: Create edit request
- `addItemToEdit`: Add item to edit
- `updateEditItem`: Update item quantity/price
- `removeEditItem`: Remove item from edit
- `confirmEdit`: Confirm and apply edit

**Usage**:
```typescript
import { useSupplierOrderEditMutations } from '@/lib/hooks/api/supplier-order-edits';

const { createEdit, addItemToEdit, confirmEdit } = useSupplierOrderEditMutations();

// Create edit
createEdit.mutate({
  supplier_order_id: 'so_123',
  note: 'Adjusting quantities',
});

// Add item
addItemToEdit.mutate({
  edit_id: 'edit_456',
  variant_id: 'var_789',
  quantity: 50,
});

// Confirm edit
confirmEdit.mutate({ edit_id: 'edit_456' });
```

---

## Uploads Hooks

**Location**: `src/lib/hooks/api/uploads/`

### Mutations

#### useAdminUploadFile

**Purpose**: Upload file to server (images, documents)

**Type**:
```typescript
type UploadResponse = {
  uploads: {
    url: string;
    key: string;
  }[];
};
```

**Usage**:
```typescript
import { useAdminUploadFile } from '@/lib/hooks/api/uploads';

const { mutate, isLoading } = useAdminUploadFile({
  onSuccess: (data) => {
    console.log('File uploaded:', data.uploads[0].url);
  },
});

const handleFileUpload = (files: File[]) => {
  mutate({ files });
};
```

#### useAdminDeleteFile

**Purpose**: Delete uploaded file

**Usage**:
```typescript
import { useAdminDeleteFile } from '@/lib/hooks/api/uploads';

const { mutate } = useAdminDeleteFile();

mutate({ fileKey: 'uploads/image.jpg' });
```

---

## Variants Hooks

**Location**: `src/lib/hooks/api/variants/`

### Queries

#### useAdminVariants

**Purpose**: Get product variants list

**Query Params**:
```typescript
type VariantQueryParams = {
  q?: string;
  limit?: number;
  offset?: number;
  product_id?: string;
  inventory_quantity?: number;
};
```

**Usage**:
```typescript
import { useAdminVariants } from '@/lib/hooks/api/variants';

const { variants, isLoading, count } = useAdminVariants({
  product_id: 'prod_123',
  limit: 50,
});
```

#### useAdminVariant

**Purpose**: Get single variant by ID

**Usage**:
```typescript
import { useAdminVariant } from '@/lib/hooks/api/variants';

const { variant, isLoading } = useAdminVariant('var_123');
```

---

## Warehouse Hooks

**Location**: `src/lib/hooks/api/warehouse/`

### Queries

#### useAdminWarehouses

**Purpose**: Get warehouses list

**Query Params**:
```typescript
type WarehouseQueryParams = {
  q?: string;
  offset?: number;
  limit?: number;
};
```

**Usage**:
```typescript
import { useAdminWarehouses } from '@/lib/hooks/api/warehouse';

const { warehouses, isLoading, count } = useAdminWarehouses({
  limit: 50,
});
```

#### useAdminWarehouse

**Purpose**: Get single warehouse by ID

**Usage**:
```typescript
import { useAdminWarehouse } from '@/lib/hooks/api/warehouse';

const { warehouse, isLoading } = useAdminWarehouse('wh_123');
```

#### useAdminWarehousesKiot

**Purpose**: Get Kiot warehouses list

**Usage**:
```typescript
import { useAdminWarehousesKiot } from '@/lib/hooks/api/warehouse';

const { warehouses, isLoading } = useAdminWarehousesKiot({
  limit: 20,
});
```

#### useAdminWarehousesInventoryVariant

**Purpose**: Get warehouse inventory for variants

**Usage**:
```typescript
import { useAdminWarehousesInventoryVariant } from '@/lib/hooks/api/warehouse';

const { inventory, isLoading } = useAdminWarehousesInventoryVariant({
  variant_id: 'var_123',
});
```

#### useAdminWarehouseInventoryByVariant

**Purpose**: Get warehouse inventory for specific variant

**Usage**:
```typescript
import { useAdminWarehouseInventoryByVariant } from '@/lib/hooks/api/warehouse';

const { inventory, isLoading } = useAdminWarehouseInventoryByVariant('var_123');
```

#### useAdminWarehouseInventoryKiotBySku

**Purpose**: Get Kiot warehouse inventory by SKU

**Usage**:
```typescript
import { useAdminWarehouseInventoryKiotBySku } from '@/lib/hooks/api/warehouse';

const { inventory, isLoading } = useAdminWarehouseInventoryKiotBySku('SKU-123');
```

#### useAdminWarehouseTransactions

**Purpose**: Get warehouse transaction history

**Query Params**:
```typescript
type TransactionQueryParams = {
  warehouse_id?: string;
  variant_id?: string;
  type?: 'inbound' | 'outbound';
  limit?: number;
  offset?: number;
};
```

**Usage**:
```typescript
import { useAdminWarehouseTransactions } from '@/lib/hooks/api/warehouse';

const { transactions, isLoading, count } = useAdminWarehouseTransactions({
  warehouse_id: 'wh_123',
  type: 'inbound',
  limit: 50,
});
```

#### useAdminWarehouseManageKiotBySku

**Purpose**: Get Kiot warehouse management data by SKU

**Usage**:
```typescript
import { useAdminWarehouseManageKiotBySku } from '@/lib/hooks/api/warehouse';

const { data, isLoading } = useAdminWarehouseManageKiotBySku({
  sku: 'SKU-123',
});
```

### Mutations

#### useWarehouseMutations

**Purpose**: Manage warehouse operations

**Available mutations**:
- `createWarehouse`: Create new warehouse
- `updateWarehouse`: Update warehouse details
- `deleteWarehouse`: Delete warehouse
- `adjustInventory`: Adjust inventory levels
- `transferInventory`: Transfer between warehouses

**Usage**:
```typescript
import { useWarehouseMutations } from '@/lib/hooks/api/warehouse';

const { createWarehouse, adjustInventory } = useWarehouseMutations();

// Create warehouse
createWarehouse.mutate({
  name: 'Main Warehouse',
  address: 'Address',
  capacity: 10000,
});

// Adjust inventory
adjustInventory.mutate({
  warehouse_id: 'wh_123',
  variant_id: 'var_456',
  quantity: 50,
  type: 'addition',
  reason: 'Stock count adjustment',
});
```

---

## Common Patterns

### Error Handling

```typescript
const { mutate, isError, error } = useMutation({
  onError: (error) => {
    console.error('Mutation failed:', error.message);
    notification.error({
      message: 'Operation failed',
      description: error.message,
    });
  },
});
```

### Loading States

```typescript
const { data, isLoading, isFetching, isRefetching } = useQuery();

if (isLoading) return <Skeleton />;
if (isFetching) return <Spin />;
```

### Pagination

```typescript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

const { data, isLoading } = useAdminProducts({
  limit: pageSize,
  offset: (page - 1) * pageSize,
});

<Pagination
  current={page}
  pageSize={pageSize}
  total={data?.count}
  onChange={setPage}
  onShowSizeChange={(_, size) => setPageSize(size)}
/>
```

### Optimistic Updates

```typescript
const queryClient = useQueryClient();

const { mutate } = useMutation(updateProduct, {
  onMutate: async (newProduct) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(productKeys.detail(id));

    // Snapshot previous value
    const previousProduct = queryClient.getQueryData(productKeys.detail(id));

    // Optimistically update
    queryClient.setQueryData(productKeys.detail(id), newProduct);

    return { previousProduct };
  },
  onError: (err, newProduct, context) => {
    // Rollback on error
    queryClient.setQueryData(
      productKeys.detail(id),
      context.previousProduct
    );
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(productKeys.detail(id));
  },
});
```

### Dependent Queries

```typescript
const { data: order } = useAdminOrder(orderId);

const { data: customer } = useAdminCustomer(order?.customer_id, {
  enabled: !!order?.customer_id, // Only run if order exists
});
```

### Infinite Queries

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery(
  productKeys.list({ limit: 20 }),
  ({ pageParam = 0 }) => fetchProducts({ offset: pageParam, limit: 20 }),
  {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.count > pages.length * 20) {
        return pages.length * 20;
      }
      return undefined;
    },
  }
);
```

---

## Query Client Configuration

**Location**: `src/lib/constants/query-client.ts`

```typescript
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      staleTime: 90000, // 90 seconds
      retry: 1, // Retry failed requests once
    },
  },
})
```

---

## Best Practices

### 1. Use Query Keys Consistently

```typescript
// Good
const productKeys = queryKeysFactory('products');
useQuery(productKeys.list({ status: 'published' }), fetchProducts);

// Bad
useQuery(['products', status], fetchProducts);
```

### 2. Handle Loading and Error States

```typescript
const { data, isLoading, isError, error } = useQuery();

if (isLoading) return <Spinner />;
if (isError) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

### 3. Invalidate Related Queries

```typescript
useMutation(updateProduct, {
  onSuccess: () => {
    queryClient.invalidateQueries(productKeys.lists());
    queryClient.invalidateQueries(productKeys.detail(id));
  },
});
```

### 4. Use TypeScript Types

```typescript
import { Product } from '@/types/products';

const { data } = useAdminProducts();
const products: Product[] = data?.products || [];
```

### 5. Combine Queries

```typescript
const { data: products } = useAdminProducts();
const { data: categories } = useAdminCategories();

const productsWithCategories = useMemo(() => {
  return products?.map(product => ({
    ...product,
    category: categories?.find(c => c.id === product.category_id),
  }));
}, [products, categories]);
```

---

## Testing API Hooks

### Mock Queries

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

test('fetches products', async () => {
  const { result } = renderHook(() => useAdminProducts(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data.products).toBeDefined();
});
```

### Mock Mutations

```typescript
test('creates product', async () => {
  const { result } = renderHook(() => useCreateProduct(), { wrapper });

  act(() => {
    result.current.mutate({ title: 'Test Product' });
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

---

## Performance Tips

1. **Use pagination**: Always paginate large lists
2. **Enable/disable queries**: Use `enabled` option for dependent queries
3. **Debounce search**: Debounce search input to reduce API calls
4. **Cache appropriately**: Adjust `staleTime` and `cacheTime` per query
5. **Prefetch data**: Use `queryClient.prefetchQuery()` for anticipated data
6. **Cancel requests**: Cancel ongoing requests when component unmounts

---

## Summary

The API hooks system provides:

- ✅ **17 categories** of custom hooks
- ✅ **Type-safe** interfaces with TypeScript
- ✅ **Automatic caching** and invalidation
- ✅ **Consistent patterns** across all hooks
- ✅ **Optimistic updates** support
- ✅ **Error handling** built-in
- ✅ **Integration** with Medusa backend
- ✅ **Query key factories** for cache management

For specific endpoint details, refer to the Medusa backend API documentation.

---

**Last Updated**: December 2024

