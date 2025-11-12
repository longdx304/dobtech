# Services Documentation

## Overview

The services layer in AdminFront provides a direct interface to the Medusa backend API. It consists of **4 main files** that handle HTTP requests, authentication, and data validation.

**Location**: `src/services/`

```
services/
├── request.js       # HTTP client with axios
├── api.js          # Main API service (30+ resources)
├── accounts.ts     # Account-related server actions
└── products.ts     # Product-related server actions
```

---

## HTTP Client (`request.js`)

### Purpose

Base HTTP client using Axios with automatic credential handling.

### Implementation

```javascript
import axios from "axios"
import { BACKEND_URL } from "@/lib/constants/medusa-backend-url"

const client = axios.create({ baseURL: BACKEND_URL })

export default function medusaRequest(method, path = "", payload = {}) {
  const options = {
    method,
    withCredentials: true, // Includes cookies in requests
    url: path,
    data: payload,
    json: true,
  }
  return client(options)
}
```

### Features

1. **Automatic Base URL**: Uses `BACKEND_URL` environment variable
2. **Credentials**: Automatically includes cookies for authentication
3. **JSON Handling**: Automatic JSON parsing
4. **Promise-based**: Returns promises for async/await

### Usage

```javascript
import medusaRequest from '@/services/request';

// GET request
const response = await medusaRequest('GET', '/admin/products');

// POST request
const response = await medusaRequest('POST', '/admin/products', {
  title: 'New Product',
});

// PUT/PATCH request
const response = await medusaRequest('POST', '/admin/products/prod_123', {
  title: 'Updated Title',
});

// DELETE request
const response = await medusaRequest('DELETE', '/admin/products/prod_123');
```

### Authentication

Authentication is handled via **HTTP-only cookies**:
- Cookie name: `_jwt_token_`
- Set by backend on successful login
- Automatically included in all requests via `withCredentials: true`
- Secure and protected from XSS attacks

---

## Main API Service (`api.js`)

### Overview

Comprehensive API service covering **30+ Medusa resources** with 200+ methods.

### Architecture

```javascript
export default {
  returnReasons: { /* methods */ },
  apps: { /* methods */ },
  auth: { /* methods */ },
  notifications: { /* methods */ },
  // ... 26 more resources
}
```

### Resources & Methods

#### 1. Return Reasons

**Purpose**: Manage return reasons for customer orders

**Methods**:
```javascript
returnReasons: {
  retrieve(id)          // Get single return reason
  list()                // Get all return reasons
  create(payload)       // Create new reason
  update(id, payload)   // Update reason
  delete(id)            // Delete reason
}
```

**Usage**:
```javascript
import api from '@/services/api';

// List all reasons
const { data } = await api.returnReasons.list();

// Create reason
await api.returnReasons.create({
  label: 'Defective Item',
  value: 'defective',
  description: 'Product is defective or damaged',
});
```

---

#### 2. Apps

**Purpose**: Manage app integrations and authorizations

**Methods**:
```javascript
apps: {
  authorize(data)  // Authorize app
  list()           // List installed apps
}
```

---

#### 3. Auth

**Purpose**: Authentication and session management

**Methods**:
```javascript
auth: {
  session()                  // Get current session
  authenticate(details)      // Login
  deauthenticate(details)    // Logout
}
```

**Usage**:
```javascript
// Login
await api.auth.authenticate({
  email: 'user@example.com',
  password: 'password123',
});

// Get session
const { data } = await api.auth.session();
console.log(data.user);

// Logout
await api.auth.deauthenticate();
```

---

#### 4. Notifications

**Purpose**: Manage admin notifications

**Methods**:
```javascript
notifications: {
  list(search = {})      // List notifications
  resend(id, config)     // Resend notification
}
```

**Query Parameters**:
```javascript
{
  limit: 20,
  offset: 0,
  is_read: false,
}
```

---

#### 5. Notes

**Purpose**: Add notes to resources (orders, products, etc.)

**Methods**:
```javascript
notes: {
  listByResource(resourceId)              // Get notes for resource
  create(resourceId, resourceType, value) // Add note
  update(id, value)                       // Update note
  delete(id)                              // Delete note
}
```

**Usage**:
```javascript
// Add note to order
await api.notes.create(
  'order_123',
  'order',
  'Customer requested gift wrapping'
);
```

---

#### 6. Customers

**Purpose**: Customer management

**Methods**:
```javascript
customers: {
  retrieve(customerId)     // Get customer
  list(search = '')        // List customers
  update(customerId, update) // Update customer
}
```

**Usage**:
```javascript
// List customers
const { data } = await api.customers.list('?q=john&limit=10');

// Update customer
await api.customers.update('cust_123', {
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
});
```

---

#### 7. Store

**Purpose**: Store configuration

**Methods**:
```javascript
store: {
  retrieve()                    // Get store config
  update(update)                // Update store
  addCurrency(code)             // Add currency
  removeCurrency(code)          // Remove currency
  listPaymentProviders()        // List payment providers
}
```

**Usage**:
```javascript
// Get store info
const { data } = await api.store.retrieve();

// Add currency
await api.store.addCurrency('EUR');

// Update store
await api.store.update({
  name: 'My Store',
  default_currency_code: 'USD',
});
```

---

#### 8. Shipping Profiles

**Purpose**: Manage shipping profiles

**Methods**:
```javascript
shippingProfiles: {
  list()                       // List profiles
  create(data)                 // Create profile
  retrieve(profileId)          // Get profile
  update(profileId, update)    // Update profile
}
```

---

#### 9. Gift Cards

**Purpose**: Gift card management

**Methods**:
```javascript
giftCards: {
  create(giftCard)           // Create gift card
  retrieve(giftCardId)       // Get gift card
  list(search = {})          // List gift cards
  update(giftCardId, update) // Update gift card
  delete(giftCardId)         // Delete gift card
}
```

**Usage**:
```javascript
// Create gift card
await api.giftCards.create({
  value: 5000, // Amount in cents
  region_id: 'reg_123',
});

// List gift cards
const { data } = await api.giftCards.list({ limit: 50 });
```

---

#### 10. Variants

**Purpose**: Product variant operations

**Methods**:
```javascript
variants: {
  list(search = {})  // List variants
}
```

---

#### 11. Products

**Purpose**: Complete product management

**Methods**:
```javascript
products: {
  create(product)               // Create product
  retrieve(productId)           // Get product
  update(productId, update)     // Update product
  delete(productId)             // Delete product
  list(search = {})             // List products
  listTypes()                   // Get product types
  listTagsByUsage()             // Get tags by usage
  
  variants: {
    create(productId, variant)               // Add variant
    retrieve(productId, variantId)           // Get variant
    update(productId, variantId, update)     // Update variant
    delete(productId, variantId)             // Delete variant
    list(productId)                          // List variants
  },
  
  options: {
    create(productId, option)                // Add option
    delete(productId, optionId)              // Delete option
    update(productId, optionId, update)      // Update option
  }
}
```

**Usage**:
```javascript
// Create product
await api.products.create({
  title: 'T-Shirt',
  description: 'Comfortable cotton t-shirt',
  variants: [{
    title: 'Small / Black',
    prices: [{ amount: 1999, currency_code: 'USD' }],
    inventory_quantity: 100,
  }],
});

// Add variant
await api.products.variants.create('prod_123', {
  title: 'Medium / White',
  sku: 'TSHIRT-M-WHT',
  prices: [{ amount: 1999, currency_code: 'USD' }],
});

// Add option
await api.products.options.create('prod_123', {
  title: 'Size',
  values: ['Small', 'Medium', 'Large'],
});
```

---

#### 12. Swaps

**Purpose**: Order swap management

**Methods**:
```javascript
swaps: {
  retrieve(swapId)       // Get swap
  update(orderId, update) // Update swap
  list(search = {})      // List swaps
}
```

---

#### 13. Returns

**Purpose**: Return management

**Methods**:
```javascript
returns: {
  list(search = {})  // List returns
}
```

---

#### 14. Collections

**Purpose**: Product collection management

**Methods**:
```javascript
collections: {
  create(payload)                 // Create collection
  retrieve(id)                    // Get collection
  list(search = {})               // List collections
  addProducts(id, payload)        // Add products
  removeProducts(id, payload)     // Remove products
}
```

**Usage**:
```javascript
// Create collection
await api.collections.create({
  title: 'Summer Collection',
  handle: 'summer-2024',
});

// Add products
await api.collections.addProducts('col_123', {
  product_ids: ['prod_456', 'prod_789'],
});
```

---

#### 15. Orders

**Purpose**: Comprehensive order management

**Methods**:
```javascript
orders: {
  create(order)                          // Create order
  receiveReturn(returnId, payload)       // Receive return
  cancelReturn(returnId)                 // Cancel return
  retrieve(orderId, search = {})         // Get order
  update(orderId, update)                // Update order
  list(search = {})                      // List orders
  complete(orderId)                      // Complete order
  archive(orderId)                       // Archive order
  capturePayment(orderId)                // Capture payment
  createShipment(orderId, payload)       // Create shipment
  updateClaim(orderId, claimId, payload) // Update claim
  createSwap(orderId, payload)           // Create swap
  cancelSwap(orderId, swapId)            // Cancel swap
  createClaim(orderId, payload)          // Create claim
  cancelClaim(orderId, claimId)          // Cancel claim
  fulfillClaim(orderId, claimId, payload)// Fulfill claim
  cancelClaimFulfillment(...)            // Cancel claim fulfillment
  createClaimShipment(...)               // Create claim shipment
  createSwapShipment(...)                // Create swap shipment
  fulfillSwap(...)                       // Fulfill swap
  cancelSwapFulfillment(...)             // Cancel swap fulfillment
  processSwapPayment(...)                // Process swap payment
  createFulfillment(orderId, payload)    // Create fulfillment
  cancelFulfillment(orderId, fulfillmentId) // Cancel fulfillment
  refund(orderId, payload)               // Refund order
  requestReturn(orderId, payload)        // Request return
  cancel(orderId)                        // Cancel order
}
```

**Usage**:
```javascript
// Capture payment
await api.orders.capturePayment('order_123');

// Create fulfillment
await api.orders.createFulfillment('order_123', {
  items: [{ item_id: 'item_456', quantity: 2 }],
});

// Request return
await api.orders.requestReturn('order_123', {
  items: [{ item_id: 'item_456', quantity: 1 }],
  return_shipping: { option_id: 'so_789' },
});

// Process refund
await api.orders.refund('order_123', {
  amount: 1999, // Amount in cents
  reason: 'customer_request',
});
```

---

#### 16. Payments

**Purpose**: Payment processing

**Methods**:
```javascript
payments: {
  capturePayment(paymentId, payload)          // Capture payment
  captureSupplierPayment(paymentId, payload)  // Capture supplier payment
}
```

---

#### 17. Shipping Options

**Purpose**: Shipping option configuration

**Methods**:
```javascript
shippingOptions: {
  create(shippingOption)    // Create option
  retrieve(id)              // Get option
  delete(id)                // Delete option
  list(search = {})         // List options
  update(id, update)        // Update option
}
```

**Usage**:
```javascript
// Create shipping option
await api.shippingOptions.create({
  name: 'Standard Shipping',
  region_id: 'reg_123',
  provider_id: 'manual',
  price_type: 'flat_rate',
  amount: 500, // $5.00
});
```

---

#### 18. Discounts

**Purpose**: Discount and promotion management

**Methods**:
```javascript
discounts: {
  create(discount)             // Create discount
  retrieve(discountId)         // Get discount
  update(discountId, update)   // Update discount
  delete(discountId)           // Delete discount
  list(search = {})            // List discounts
  retrieveByCode(code)         // Get by code
}
```

**Usage**:
```javascript
// Create discount
await api.discounts.create({
  code: 'SUMMER20',
  rule: {
    type: 'percentage',
    value: 20,
    allocation: 'total',
  },
  regions: ['reg_123'],
  usage_limit: 100,
});
```

---

#### 19. Regions

**Purpose**: Regional configuration

**Methods**:
```javascript
regions: {
  list()                    // List regions
  retrieve(id)              // Get region
  create(region)            // Create region
  update(id, region)        // Update region
  delete(id)                // Delete region
  fulfillmentOptions: {
    list(regionId)          // List fulfillment options
  }
}
```

---

#### 20. Draft Orders

**Purpose**: Draft order management

**Methods**:
```javascript
draftOrders: {
  create(draftOrder)                        // Create draft
  addLineItem(draftOrderId, line)           // Add item
  updateLineItem(draftOrderId, lineId, line)// Update item
  deleteLineItem(draftOrderId, lineId)      // Delete item
  retrieve(id)                              // Get draft
  delete(id)                                // Delete draft
  update(id, payload)                       // Update draft
  registerSystemPayment(id)                 // Register payment
  transferToOrder(id)                       // Convert to order
  list(search = {})                         // List drafts
}
```

**Usage**:
```javascript
// Create draft order
const { data } = await api.draftOrders.create({
  email: 'customer@example.com',
  region_id: 'reg_123',
  items: [{ variant_id: 'var_456', quantity: 2 }],
  shipping_methods: [{ option_id: 'so_789' }],
});

// Transfer to order
await api.draftOrders.transferToOrder(data.draft_order.id);
```

---

#### 21. Invites

**Purpose**: User invitation management

**Methods**:
```javascript
invites: {
  create(data)      // Create invite
  resend(inviteId)  // Resend invite
  delete(inviteId)  // Delete invite
  list()            // List invites
  accept(data)      // Accept invite
}
```

---

#### 22. Users

**Purpose**: User management

**Methods**:
```javascript
users: {
  resetPasswordToken(data)  // Request password reset
  resetPassword(data)       // Reset password
  list()                    // List users
  retrieve(userId)          // Get user
  update(userId, data)      // Update user
  delete(userId)            // Delete user
}
```

**Usage**:
```javascript
// Request password reset
await api.users.resetPasswordToken({
  email: 'user@example.com',
});

// Reset password
await api.users.resetPassword({
  token: 'reset_token',
  password: 'new_password',
});

// Update user
await api.users.update('user_123', {
  first_name: 'John',
  last_name: 'Doe',
});
```

---

## Server Actions

### accounts.ts

**Purpose**: Server-side authentication and validation

#### adminLogIn

```typescript
export async function adminLogIn(
  _currentState: unknown, 
  formData: FormData
)
```

**Features**:
- Zod schema validation
- Email format validation
- Password minimum length (6 characters)
- Vietnamese error messages
- Automatic revalidation

**Schema**:
```typescript
const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, {
    message: 'Mật khẩu phải ít nhất phải có 6 ký tự',
  }),
});
```

**Usage** (in form):
```typescript
'use server'
import { adminLogIn } from '@/services/accounts';

<form action={adminLogIn}>
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Login</button>
</form>
```

---

### products.ts

**Purpose**: Product creation validation

#### createProduct

```typescript
export async function createProduct(
  _currentState: unknown,
  formData: FormData
)
```

**Schema**:
```typescript
const createProductSchema = z.object({
  productName: z.string()
    .min(2, 'Sản phẩm phải có ít nhất 2 ký tự')
    .max(50, 'Sản phẩm không được vượt quá 50 ký tự'),
  color: z.string()
    .min(2, 'Màu sắc phải có ít nhất 2 kí tự')
    .max(20, 'Màu sắc không được vượt quá 20 kí tự'),
  quantity: z.number().int().min(1, 'Số lượng phải lớn hơn 0'),
  price: z.number().min(1, 'Giá tiền phải lớn hơn 0'),
  inventoryQuantity: z.number().int().min(1, 
    'Số lượng tồn kho phải lớn hơn 0'
  ),
});
```

---

## Utility Functions

### removeNullish

Removes null/undefined values from objects:

```javascript
const removeNullish = (obj) =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v ? ((a[k] = v), a) : a), 
    {}
  );
```

**Usage**:
```javascript
const clean = removeNullish({
  name: 'Product',
  price: 100,
  category: null,
  tags: undefined,
});
// Result: { name: 'Product', price: 100 }
```

### buildQueryFromObject

Builds query strings from nested objects:

```javascript
const buildQueryFromObject = (search, prefix = '') =>
  Object.entries(search)
    .map(([key, value]) =>
      typeof value === 'object'
        ? buildQueryFromObject(value, key)
        : `${prefix ? `${prefix}[${key}]` : `${key}`}=${value}`
    )
    .join('&');
```

**Usage**:
```javascript
buildQueryFromObject({
  limit: 10,
  filter: { status: 'active', price: { gt: 100 } }
});
// Result: "limit=10&filter[status]=active&filter[price][gt]=100"
```

---

## Error Handling

### Standard Error Responses

All API methods return promises that resolve or reject:

```javascript
try {
  const { data } = await api.products.retrieve('prod_123');
  console.log(data.product);
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.status);
    console.error(error.response.data.message);
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
  } else {
    // Other error
    console.error(error.message);
  }
}
```

### Common Error Codes

- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Not logged in
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Duplicate or constraint violation
- `422`: Unprocessable Entity - Validation error
- `500`: Internal Server Error - Server issue

---

## Integration with React Query

Services are primarily used through custom hooks but can be used directly:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (product) => api.products.create(product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
      },
    }
  );
}
```

---

## Best Practices

### 1. Use Custom Hooks

Prefer custom hooks over direct service calls:

```typescript
// Good
import { useAdminProducts } from '@/lib/hooks/api/product';
const { products, isLoading } = useAdminProducts();

// Avoid (unless necessary)
import api from '@/services/api';
const { data } = await api.products.list();
```

### 2. Handle Errors Gracefully

```typescript
const handleDelete = async (id) => {
  try {
    await api.products.delete(id);
    notification.success({ message: 'Product deleted' });
  } catch (error) {
    notification.error({ 
      message: 'Failed to delete',
      description: error.response?.data?.message 
    });
  }
};
```

### 3. Clean Search Parameters

```typescript
const searchProducts = (params) => {
  const cleanParams = removeNullish(params);
  return api.products.list(cleanParams);
};
```

### 4. Type Safety

Use TypeScript types from `@/types/*`:

```typescript
import { Product } from '@/types/products';

const createProduct = async (product: Partial<Product>) => {
  return api.products.create(product);
};
```

---

## Testing

### Unit Tests

```typescript
import api from '@/services/api';
import medusaRequest from '@/services/request';

jest.mock('@/services/request');

describe('api.products', () => {
  it('creates a product', async () => {
    const mockProduct = { id: 'prod_123', title: 'Test' };
    medusaRequest.mockResolvedValue({ data: { product: mockProduct } });
    
    const result = await api.products.create({ title: 'Test' });
    
    expect(result.data.product).toEqual(mockProduct);
    expect(medusaRequest).toHaveBeenCalledWith(
      'POST',
      '/admin/products',
      { title: 'Test' }
    );
  });
});
```

---

## Performance Considerations

### 1. Debounce Search Requests

```typescript
import { debounce } from 'lodash';

const searchProducts = debounce(
  (query) => api.products.list({ q: query }),
  300
);
```

### 2. Cancel Pending Requests

```typescript
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

const searchProducts = (query) => {
  if (cancel) cancel();
  
  return api.products.list(
    { q: query },
    { cancelToken: new CancelToken(c => cancel = c) }
  );
};
```

### 3. Batch Operations

```typescript
const deleteMultiple = async (ids) => {
  return Promise.all(
    ids.map(id => api.products.delete(id))
  );
};
```

---

## Summary

The services layer provides:

- ✅ **Direct API access** to 30+ resources
- ✅ **200+ methods** for all operations
- ✅ **Type-safe** server actions
- ✅ **Validation** with Zod schemas
- ✅ **Error handling** built-in
- ✅ **Authentication** via cookies
- ✅ **Query building** utilities
- ✅ **Promise-based** async operations

**When to use**:
- In custom hooks
- In server components/actions
- For direct API calls when hooks don't fit
- In utility functions

**When not to use**:
- In regular components (use hooks instead)
- When built-in Medusa React hooks exist
- For simple queries (use custom hooks)

---

**Last Updated**: December 2024

**Related Documentation**:
- [API Hooks](./API_HOOKS.md) - Custom React Query hooks
- [Types](./TYPES.md) - TypeScript type definitions
- [Providers](./PROVIDERS.md) - Medusa provider setup

