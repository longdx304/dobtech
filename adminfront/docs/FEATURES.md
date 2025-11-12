# Features Documentation

## Overview

AdminFront provides comprehensive e-commerce management capabilities through two portals: **Admin Portal** and **Kiot Portal**. This document details all features available in both portals.

---

# Admin Portal Features

The Admin Portal (`/admin/*`) is the main management interface with **16 major feature modules** comprising **400+ components**.

## 1. Accounts Management

**Location**: `src/modules/admin/account/`
**Components**: 5
**Route**: `/admin/accounts`
**Permissions**: Manager only

### Features

#### User Account Management
- Create, edit, and delete user accounts
- Assign roles (Admin, Member)
- Set permissions (Manager, Warehouse, Driver, Accountant)
- View user activity logs
- Manage user status (active/inactive)

### Components

#### AccountList (`components/account-list/`)
- **account-column.tsx**: Table columns definition
- **index.tsx**: Main account list view with search and filters

#### AccountModal (`components/account-modal/`)
- **index.tsx**: Account creation/edit modal
- **user-modal.tsx**: User details modal

#### Login (`components/login/`)
- **index.tsx**: Login form component

### Key Functionalities

1. **User Creation**
   ```typescript
   {
     email: string;
     first_name: string;
     last_name: string;
     role: 'admin' | 'member';
     permissions: string; // Comma-separated permissions
   }
   ```

2. **Permission Types**
   - `Manager`: Full access to products, customers, orders
   - `Warehouse`: Warehouse operations
   - `Driver`: Shipment management
   - `Accountant`: Supplier and financial operations

3. **Account Actions**
   - Edit user details
   - Reset password
   - Change permissions
   - Deactivate/reactivate accounts
   - Delete accounts

---

## 2. Currencies Management

**Location**: `src/modules/admin/currencies/`
**Components**: 4
**Route**: `/admin/currencies`
**Permissions**: Manager only

### Features

#### Currency Configuration
- Add/remove supported currencies
- Set default currency
- Configure exchange rates
- Manage currency display formats

### Components

#### CurrencyModal (`components/currency-modal/`)
- **currency-column.tsx**: Table columns for currency list
- **index.tsx**: Modal for adding/editing currencies

#### Templates (`templates/`)
- **currency-column.tsx**: Currency table column definitions
- **manage-currencies.tsx**: Main currencies management page

### Key Functionalities

1. **Supported Currencies**
   - Add currency (USD, EUR, VND, etc.)
   - Remove currency from store
   - Set as default currency

2. **Currency Display**
   - Currency code (USD, EUR)
   - Currency symbol ($, €, ₫)
   - Decimal places configuration

---

## 3. Customers Management

**Location**: `src/modules/admin/customers/`
**Components**: 13
**Route**: `/admin/customers`
**Permissions**: Manager only

### Features

#### Customer Management
- View customer directory
- Create/edit customer profiles
- Manage customer groups
- View customer order history
- Assign customers to groups
- Custom pricing per customer

### Components

#### CustomerGroupModal (`components/customer-group-modal/`)
- **index.tsx**: Create/edit customer groups

#### EditCustomerModal (`components/edit-customer-modal/`)
- **index.tsx**: Edit customer details

#### MemberModal (`components/member-modal/`)
- **add-customer-columns.tsx**: Columns for adding customers
- **add-customer-group.tsx**: Add customer to group
- **index.tsx**: Member management modal
- **member-columns.tsx**: Member list columns

#### OrdersModal (`components/orders-modal/`)
- **index.tsx**: Customer orders view
- **order-columns.tsx**: Order table columns

#### Templates (`templates/`)
- **customer-group/**: Customer group management pages
- **customers/**: Customer list and details pages
- **manage-customer.tsx**: Main customer management page

### Key Functionalities

1. **Customer Profile**
   ```typescript
   {
     email: string;
     first_name: string;
     last_name: string;
     phone?: string;
     billing_address?: Address;
     shipping_address?: Address;
     groups?: CustomerGroup[];
   }
   ```

2. **Customer Groups**
   - Create groups (VIP, Wholesale, Retail, etc.)
   - Assign custom pricing to groups
   - Bulk assign customers to groups
   - Group-based discounts

3. **Customer Analytics**
   - Total orders
   - Lifetime value
   - Average order value
   - Order frequency

---

## 4. Dashboard

**Location**: `src/modules/admin/dashboard/`
**Components**: 1
**Route**: `/admin/dashboard` or `/admin`
**Permissions**: All authenticated users

### Features

#### Overview Dashboard
- Sales summary
- Recent orders
- Low stock alerts
- Pending tasks
- Quick actions

### Components

- **index.tsx**: Main dashboard view

### Key Metrics

1. **Sales Metrics**
   - Today's revenue
   - This month's revenue
   - Revenue growth rate
   - Order count

2. **Inventory Metrics**
   - Total products
   - Low stock items
   - Out of stock items
   - Pending inbound

3. **Order Metrics**
   - Pending orders
   - Processing orders
   - Completed orders
   - Cancelled orders

---

## 5. Discounts

**Location**: `src/modules/admin/discounts/`
**Components**: 58 (most complex module)
**Route**: `/admin/discounts`
**Permissions**: Manager only

### Features

#### Comprehensive Discount System
- Percentage discounts
- Fixed amount discounts
- Free shipping promotions
- Buy X Get Y offers
- Dynamic discount rules
- Condition-based discounts
- Usage limits
- Time-based activations

### Component Structure

#### Common Components (`components/common/`)
- **back-to-discount/**: Navigation back to discount list
- **numbered-item/**: Numbered list items for discount rules

#### Details Components (`components/details/`)
31 components for discount details view:
- Discount information display
- Conditions display
- Usage statistics
- Edit controls
- Configuration panels

#### Discount Form (`components/discount-form/`)
20 components for creating/editing:
- General information form
- Discount type selection
- Condition builder
- Rule configuration
- Date/time pickers
- Usage limit settings

#### Modal (`components/modal/`)
- Discount quick actions modal

#### Templates (`templates/`)
- **discount-detail/**: Discount details page
- **discounts/**: Discount list and management

### Key Functionalities

1. **Discount Types**
   ```typescript
   type DiscountType = 
     | 'percentage'    // 10% off
     | 'fixed'         // $10 off
     | 'free_shipping' // Free shipping
   ```

2. **Discount Conditions**
   - Minimum purchase amount
   - Specific products/collections
   - Customer groups
   - Regions
   - Order count (first order, etc.)

3. **Discount Rules**
   ```typescript
   {
     code: string;
     type: DiscountType;
     value: number;
     regions?: string[];
     starts_at: Date;
     ends_at?: Date;
     usage_limit?: number;
     valid_for: string[];
   }
   ```

4. **Advanced Features**
   - Automatic discounts (no code needed)
   - Stackable discounts
   - Exclusive discounts
   - Dynamic rules based on cart content
   - Multi-tier discounts

---

## 6. Draft Orders

**Location**: `src/modules/admin/draft-orders/`
**Components**: 20
**Route**: `/admin/draft-orders`
**Permissions**: Manager only

### Features

#### Draft Order Creation
- Create orders on behalf of customers
- Add products with custom pricing
- Apply discounts manually
- Calculate shipping
- Add custom line items
- Transfer to regular order
- Send payment link to customer

### Component Structure

#### BackToDorders (`components/back-to-dorders/`)
- Navigation component

#### CreateCustomerModal (`components/create-customer-modal/`)
- Quick customer creation during order

#### CustomerInfo (`components/customer-info/`)
- 2 components: Customer selection and info display

#### DraftOrderModal (`components/draft-order-modal/`)
- Draft order actions modal

#### Information (`components/information/`)
- Order information display

#### New (`components/new/`)
7 components for new draft order:
- Product selection
- Quantity input
- Price override
- Discount application
- Shipping calculator
- Customer selector
- Payment method

#### Summary (`components/summary/`)
- Order summary display
- Total calculations

#### Hooks
- **use-new-draft-form.tsx**: Form state management

#### Templates
- **draft-order-detail/**: Individual draft order view
- **draft-orders/**: Draft orders list

### Key Functionalities

1. **Draft Order Creation Flow**
   ```
   1. Select Customer
   2. Add Products
   3. Set Quantities
   4. Apply Discounts
   5. Calculate Shipping
   6. Review & Create
   7. Transfer to Order (optional)
   ```

2. **Custom Pricing**
   - Override product prices
   - Add custom line items
   - Apply manual discounts
   - Adjust taxes

3. **Order Actions**
   - Save as draft
   - Send payment link
   - Register payment
   - Transfer to order
   - Delete draft

---

## 7. Gift Cards

**Location**: `src/modules/admin/gift-card/`
**Components**: 11
**Route**: `/admin/gift-cards`
**Permissions**: Manager only

### Features

#### Gift Card Management
- Create gift cards
- Set denominations
- Generate gift card codes
- Track usage
- Deactivate cards
- View transaction history
- Custom gift card designs

### Component Structure

#### BackToGiftCards (`components/back-to-gift-cards/`)
- Navigation component

#### DenominationsSection (`components/denominations-section/`)
3 components for gift card denominations:
- Create denomination
- Edit denomination
- Remove denomination

#### Modal (`components/modal/`)
2 components:
- Gift card creation modal
- Gift card edit modal

#### Templates
- **gift-cards/**: 4 components for gift card management
- **manage/**: Gift card admin page

### Key Functionalities

1. **Gift Card Properties**
   ```typescript
   {
     code: string;
     value: number;
     balance: number;
     region_id: string;
     is_disabled: boolean;
     ends_at?: Date;
   }
   ```

2. **Denominations**
   - Predefined amounts ($25, $50, $100)
   - Custom amounts
   - Multiple currencies

3. **Gift Card Actions**
   - Create new card
   - Update balance
   - Disable/enable
   - View transaction history
   - Export gift card codes

---

## 8. Item Units

**Location**: `src/modules/admin/item-unit/`
**Components**: 3
**Route**: `/admin/item-unit`
**Permissions**: Manager, Warehouse

### Features

#### Product Unit Management
- Define product units (box, piece, kg, etc.)
- Set conversion rates
- Manage unit hierarchies
- Apply to products

### Components

- **item-unit-modal.tsx**: Create/edit unit modal

#### Templates
- **item-unit.column.tsx**: Unit table columns
- **manage-item-unit.tsx**: Main units management page

### Key Functionalities

1. **Unit Types**
   - Base units (piece, kg, liter)
   - Compound units (box of 12, pack of 6)
   - Weight units
   - Volume units

2. **Unit Conversion**
   ```typescript
   {
     name: string;
     base_unit: string;
     conversion_rate: number;
   }
   ```

3. **Unit Operations**
   - Create unit
   - Edit unit
   - Delete unit
   - Assign to products

---

## 9. Orders

**Location**: `src/modules/admin/orders/`
**Components**: 78 (second largest module)
**Route**: `/admin/orders`
**Permissions**: Manager only

### Features

#### Complete Order Management System
- View all orders with advanced filtering
- Order details with timeline
- Fulfillment management
- Payment capture
- Returns processing
- Swaps handling
- Claims management
- Refunds
- Order editing
- Notes and comments
- Email notifications
- Print invoices
- Assign handlers

### Component Structure

#### Common Components (`components/common/`)
8 components:
- Shared order utilities
- Order status displays
- Payment status
- Fulfillment status

#### Orders Components (`components/orders/`)
64 components covering:
- **Order list**: Filtering, sorting, search
- **Order detail**: Complete order information
- **Timeline**: Order event history
- **Fulfillment**: Create, view, cancel fulfillments
- **Returns**: Request, receive, cancel returns
- **Swaps**: Create, process swaps
- **Claims**: Create, process claims
- **Payments**: Capture, refund payments
- **Edit**: Modify order details
- **Notes**: Add order notes
- **Customer**: View customer info
- **Shipping**: Tracking and shipping details
- **Items**: Line items management
- **Transfers**: Order transfers between warehouses
- **Print**: Invoice and packing slip generation

#### Hooks
- **use-build-timeline.tsx**: Build order timeline
- **use-stock-locations.tsx**: Stock location management

#### Templates
- **manage-orders.tsx**: Orders list page
- **order-detail/**: Individual order page

### Key Functionalities

1. **Order Lifecycle**
   ```
   Pending → Paid → Fulfilled → Completed
   
   Optional branches:
   → Return Requested → Return Received
   → Swap Created → Swap Fulfilled
   → Claim Created → Claim Resolved
   → Cancelled
   → Archived
   ```

2. **Order Status Types**
   ```typescript
   enum OrderStatus {
     PENDING = 'pending',
     COMPLETED = 'completed',
     ARCHIVED = 'archived',
     CANCELED = 'canceled',
     REQUIRES_ACTION = 'requires_action',
   }
   
   enum PaymentStatus {
     NOT_PAID = 'not_paid',
     AWAITING = 'awaiting',
     CAPTURED = 'captured',
     REFUNDED = 'refunded',
     PARTIALLY_REFUNDED = 'partially_refunded',
     CANCELED = 'canceled',
   }
   
   enum FulfillmentStatus {
     NOT_FULFILLED = 'not_fulfilled',
     PARTIALLY_FULFILLED = 'partially_fulfilled',
     FULFILLED = 'fulfilled',
     PARTIALLY_SHIPPED = 'partially_shipped',
     SHIPPED = 'shipped',
     PARTIALLY_RETURNED = 'partially_returned',
     RETURNED = 'returned',
     CANCELED = 'canceled',
     REQUIRES_ACTION = 'requires_action',
   }
   ```

3. **Fulfillment Management**
   - Create fulfillment
   - Assign to warehouse
   - Create shipment
   - Add tracking number
   - Cancel fulfillment
   - Mark as shipped

4. **Returns & Swaps**
   - Request return with reason
   - Receive return items
   - Process refund
   - Create swap order
   - Fulfill swap items
   - Handle return shipping

5. **Order Timeline**
   - Order placed
   - Payment received
   - Fulfillment created
   - Order shipped
   - Order delivered
   - Return requested
   - Refund processed
   - All custom events

6. **Advanced Features**
   - Split fulfillments
   - Partial refunds
   - Edit order (add/remove items)
   - Transfer to different region
   - Create draft order from existing
   - Assign order handler
   - Custom pricing per order

---

## 10. Pricing

**Location**: `src/modules/admin/pricing/`
**Components**: 23
**Route**: `/admin/pricing`
**Permissions**: Manager only

### Features

#### Price List Management
- Create price lists for customer groups
- Set prices per product/variant
- Override default prices
- Date-based pricing
- Region-specific pricing
- Bulk price updates
- Import/export prices

### Component Structure

#### PricingDetailModal (`components/pricing-detail-modal/`)
4 components:
- View price list details
- Edit price list
- View applied products
- Customer group assignment

#### PricingModal (`components/pricing-modal/`)
11 components:
- Create price list
- Set price list name
- Select customer groups
- Set date ranges
- Configure regions
- Set status

#### PricingProductModal (`components/pricing-product-modal/`)
6 components:
- Add products to price list
- Set product prices
- Set variant prices
- Bulk price setting

#### Templates
- **pricing-column.tsx**: Price list table columns
- **pricing-list.tsx**: Price lists management page

### Key Functionalities

1. **Price List Structure**
   ```typescript
   {
     name: string;
     description?: string;
     type: 'sale' | 'override';
     status: 'active' | 'draft';
     starts_at?: Date;
     ends_at?: Date;
     customer_groups: string[];
     prices: {
       variant_id: string;
       amount: number;
       currency_code: string;
     }[];
   }
   ```

2. **Price Types**
   - Sale prices (promotional)
   - Override prices (permanent)
   - Quantity-based pricing
   - Customer group pricing

3. **Price Operations**
   - Create price list
   - Add products
   - Set prices per variant
   - Apply to customer groups
   - Set date ranges
   - Export price list

---

## 11. Product Categories

**Location**: `src/modules/admin/product-categories/`
**Components**: 4
**Route**: `/admin/product-categories`
**Permissions**: Manager only

### Features

#### Nested Category Management
- Create category hierarchies
- Drag-and-drop reordering
- Category thumbnails
- SEO metadata
- Active/inactive status
- Nested unlimited levels

### Component Structure

#### CategoryItem (`components/category-item/`)
- Single category display with drag handle

#### CategoryList (`components/category-list/`)
- Nestable category tree

#### CategoryModal (`components/category-modal/`)
- Create/edit category modal

#### Styles
- **product-categories.css**: Custom styles for drag-and-drop

### Key Functionalities

1. **Category Properties**
   ```typescript
   {
     name: string;
     description?: string;
     handle: string;
     is_active: boolean;
     is_internal: boolean;
     parent_category_id?: string;
     rank: number;
     metadata?: Record<string, any>;
   }
   ```

2. **Category Operations**
   - Create category
   - Edit category
   - Delete category
   - Reorder categories (drag-and-drop)
   - Set parent category
   - Upload thumbnail

3. **Nested Structure**
   ```
   Electronics
   ├── Computers
   │   ├── Laptops
   │   └── Desktops
   ├── Phones
   │   ├── Smartphones
   │   └── Feature Phones
   └── Accessories
   ```

---

## 12. Products

**Location**: `src/modules/admin/products/`
**Components**: 54 (third largest module)
**Route**: `/admin/products`
**Permissions**: Manager, Warehouse, Driver, Accountant

### Features

#### Comprehensive Product Management
- Product catalog
- Variants with options
- Inventory tracking
- Product images and media
- Collections
- Pricing
- SEO optimization
- Product status
- Tags and types
- Product search
- Bulk operations
- Import/export

### Component Structure

#### CollectionList (`components/collection-list/`)
2 components:
- Collection table
- Collection display

#### CollectionModal (`components/collection-modal/`)
4 components:
- Create collection
- Edit collection
- Add products to collection
- Remove products

#### ManageProduct (`components/manage-product/`)
3 components:
- Product form
- Product wizard
- Product validation

#### ProductDetail (`components/product-detail/`)
26 components covering:
- **General information**: Title, description, status
- **Media**: Images, thumbnails
- **Variants**: Create, edit, delete variants
- **Options**: Product options (size, color, etc.)
- **Pricing**: Prices per variant
- **Inventory**: Stock levels
- **Shipping**: Dimensions, weight
- **Attributes**: Custom attributes
- **Organization**: Categories, collections, tags, type
- **Metadata**: Custom metadata
- **Supplier pricing**: Supplier costs

#### ProductSearch (`components/product-search/`)
- Advanced product search

#### ProductsList (`components/products-list/`)
4 components:
- Product table
- Product columns
- Product filters
- Product actions

#### ProductsModal (`components/products-modal/`)
14 components:
- Quick product actions
- Add variant
- Edit variant
- Inventory adjustment
- Price update
- Image upload

### Key Functionalities

1. **Product Structure**
   ```typescript
   {
     title: string;
     subtitle?: string;
     description?: string;
     handle: string;
     is_giftcard: boolean;
     status: 'draft' | 'proposed' | 'published' | 'rejected';
     thumbnail?: string;
     images: ProductImage[];
     options: ProductOption[];
     variants: ProductVariant[];
     categories: ProductCategory[];
     collection_id?: string;
     tags: ProductTag[];
     type: ProductType;
     weight?: number;
     length?: number;
     height?: number;
     width?: number;
     metadata?: Record<string, any>;
   }
   ```

2. **Product Variants**
   ```typescript
   {
     title: string;
     sku: string;
     ean?: string;
     upc?: string;
     barcode?: string;
     inventory_quantity: number;
     allow_backorder: boolean;
     manage_inventory: boolean;
     prices: MoneyAmount[];
     options: ProductOptionValue[];
     weight?: number;
     material?: string;
   }
   ```

3. **Product Options**
   - Size, Color, Material, etc.
   - Multiple options per product
   - Option values
   - Variant generation from options

4. **Collections**
   - Manual collections
   - Automatic collections (rules-based)
   - Featured products
   - Collection images

5. **Product Operations**
   - Create product
   - Edit product
   - Duplicate product
   - Delete product
   - Publish/unpublish
   - Export products (Excel)
   - Import products (Excel)
   - Bulk update prices
   - Bulk update inventory

6. **Inventory Management**
   - Track inventory
   - Set stock levels
   - Low stock alerts
   - Backorder management
   - Multi-warehouse inventory

---

## 13. Regions

**Location**: `src/modules/admin/regions/`
**Components**: 9
**Route**: `/admin/regions`
**Permissions**: Manager only

### Features

#### Regional Configuration
- Create regions (countries/areas)
- Configure currencies per region
- Set tax rates
- Manage payment providers
- Configure fulfillment providers
- Shipping options per region

### Component Structure

#### RegionModal (`components/region-modal/`)
2 components:
- Create region
- Edit region

#### ShippingModal (`components/shipping-modal/`)
5 components:
- Create shipping option
- Edit shipping option
- Set shipping prices
- Configure shipping requirements
- Shipping provider settings

#### Templates
- **manage-region.tsx**: Regions management page
- **region-column.tsx**: Region table columns

### Key Functionalities

1. **Region Configuration**
   ```typescript
   {
     name: string;
     currency_code: string;
     tax_rate: number;
     tax_code?: string;
     countries: Country[];
     payment_providers: PaymentProvider[];
     fulfillment_providers: FulfillmentProvider[];
     includes_tax: boolean;
   }
   ```

2. **Shipping Options**
   - Flat rate shipping
   - Calculated shipping
   - Free shipping
   - Pickup
   - Express/standard options
   - Price-based shipping rules
   - Weight-based shipping rules

3. **Payment Providers**
   - Stripe
   - PayPal
   - Manual payment
   - Custom providers

4. **Fulfillment Providers**
   - Manual fulfillment
   - Third-party logistics
   - Custom providers

---

## 14. Return Reasons

**Location**: `src/modules/admin/return-reasons/`
**Components**: 3
**Route**: `/admin/return-reasons`
**Permissions**: Manager only

### Features

#### Return Reason Management
- Create return reasons
- Set reason labels
- Set reason descriptions
- Active/inactive status
- Used in return flow

### Components

- **reason-modal.tsx**: Create/edit reason modal

#### Templates
- **manage-return-reasons.tsx**: Main management page
- **return-reasons-column.tsx**: Table columns

### Key Functionalities

1. **Return Reasons**
   - Defective item
   - Wrong item received
   - No longer needed
   - Better price elsewhere
   - Accidental order
   - Custom reasons

2. **Reason Properties**
   ```typescript
   {
     label: string;
     value: string;
     description?: string;
     parent_return_reason_id?: string;
   }
   ```

---

## 15. Supplier Orders

**Location**: `src/modules/admin/supplier-orders/`
**Components**: 68 (fourth largest module)
**Route**: `/admin/supplier-orders`
**Permissions**: Manager, Accountant

### Features

#### Purchase Order Management
- Create purchase orders
- Submit to suppliers
- Track order status
- Receive shipments
- Process payments
- Handle returns to supplier
- Order modifications
- Payment schedules
- Supplier invoices
- Order timeline

### Component Structure

#### Common (`common/`)
6 components:
- Add product variant
- Address form
- Display total
- Payment details
- Tracking link
- Shared utilities

#### SupplierOrderDetail (`components/supplier-order-detail/`)
37 components covering:
- Order information
- Items list
- Supplier details
- Payment tracking
- Receiving workflow
- Returns handling
- Order edits
- Notes
- Timeline
- Documents
- Invoice generation

#### SupplierOrdersModal (`components/supplier-orders-modal/`)
9 components:
- Create order
- Edit order
- Add items
- Remove items
- Update quantities
- Set prices
- Apply discounts

#### SupplierOrdersSample (`components/supplier-orders-sample/`)
9 components:
- Order templates
- Sample orders
- Quick creation

#### Hooks
- **use-build-timeline.tsx**: Timeline builder
- **use-supplier-time.tsx**: Time tracking

#### Templates
- **supplier-order-column/**: Table columns
- **supplier-orders-detail/**: Detail page
- **supplier-orders-list.tsx**: Orders list

### Key Functionalities

1. **Supplier Order Lifecycle**
   ```
   Draft → Submitted → Confirmed → 
   Partially Received → Received → 
   Paid → Completed
   
   Optional:
   → Returned
   → Cancelled
   ```

2. **Order Structure**
   ```typescript
   {
     supplier_id: string;
     status: SupplierOrderStatus;
     payment_status: PaymentStatus;
     fulfillment_status: FulfillmentStatus;
     items: SupplierOrderItem[];
     subtotal: number;
     tax_total: number;
     total: number;
     currency_code: string;
     expected_arrival: Date;
     received_at?: Date;
     notes?: string;
   }
   ```

3. **Order Items**
   ```typescript
   {
     variant_id: string;
     quantity: number;
     unit_price: number;
     received_quantity: number;
     metadata?: Record<string, any>;
   }
   ```

4. **Receiving Process**
   - Create receiving
   - Scan/enter received quantities
   - Handle discrepancies
   - Update inventory
   - Generate receiving report

5. **Payment Tracking**
   - Payment terms
   - Payment schedule
   - Partial payments
   - Payment history
   - Outstanding balance

6. **Supplier Order Edits**
   - Add items
   - Remove items
   - Update quantities
   - Update prices
   - Change delivery date

---

## 16. Suppliers

**Location**: `src/modules/admin/suppliers/`
**Components**: 3
**Route**: `/admin/suppliers`
**Permissions**: Manager, Accountant

### Features

#### Supplier Directory
- Supplier profiles
- Contact information
- Product catalog per supplier
- Pricing information
- Performance metrics
- Payment terms
- Order history

### Component Structure

#### SupplierColumn (`components/supplier-column/`)
- Table columns definition

#### SupplierModal (`components/supplier-modal/`)
- Create/edit supplier modal

#### Templates
- **suppliers-list.tsx**: Suppliers list page

### Key Functionalities

1. **Supplier Profile**
   ```typescript
   {
     name: string;
     email: string;
     phone: string;
     address: Address;
     payment_terms?: string;
     lead_time_days?: number;
     minimum_order?: number;
     notes?: string;
   }
   ```

2. **Supplier Metrics**
   - Total orders
   - On-time delivery rate
   - Quality rating
   - Total spend
   - Active products

3. **Supplier Operations**
   - Create supplier
   - Edit supplier
   - View supplier orders
   - View supplier products
   - Deactivate supplier

---

## 17. Warehouse

**Location**: `src/modules/admin/warehouse/`
**Components**: 40
**Route**: `/admin/warehouse/*`
**Permissions**: Warehouse, Manager, Driver (varies by sub-module)

### Features

#### Complete Warehouse Management System
- Inventory tracking
- Inbound operations (receiving)
- Outbound operations (picking & packing)
- Stock level monitoring
- Transaction history
- Multi-warehouse support
- Stock transfers
- Inventory adjustments
- Shipment management

### Sub-Modules

#### Warehouse Inbound (`warehouse/inbound/`)
**Route**: `/admin/warehouse/inbound`
**Components**: 8

**Features**:
- Receive supplier orders
- Assign handlers
- Confirm receipt
- Update inventory
- Generate receiving reports

**Components**:
- 6 component files for inbound workflow
- 2 template files for inbound pages

#### Warehouse Outbound (`warehouse/outbound/`)
**Route**: `/admin/warehouse/outbound`
**Components**: 7

**Features**:
- Pick customer orders
- Pack orders
- Print packing slips
- Create shipments
- Assign carriers

**Components**:
- 5 component files for outbound workflow
- 2 template files for outbound pages

#### Warehouse Manage (`warehouse/manage/`)
**Route**: `/admin/warehouse/manage`
**Components**: 11

**Features**:
- Create warehouses
- Edit warehouse details
- View warehouse inventory
- Manage stock levels
- Warehouse capacity

**Components**:
- 6 component files for warehouse management
- 5 template files for management pages

#### Warehouse Shipment (`warehouse/shipment/`)
**Route**: `/admin/warehouse/shipment`
**Components**: 4

**Features**:
- View shipments
- Track packages
- Update tracking numbers
- Delivery confirmation

**Components**:
- 1 component file
- 3 template files

#### Warehouse Stock Checker (`warehouse/stock-checker/`)
**Route**: `/admin/warehouse/stock-checker`
**Components**: 4

**Features**:
- Real-time stock checking
- Low stock alerts
- Stock history
- Reorder suggestions

**Components**:
- 1 component file
- 3 template files

#### Warehouse Transactions (`warehouse/transactions/`)
**Route**: `/admin/warehouse/transactions`
**Components**: 2

**Features**:
- Transaction log
- Inventory movements
- Audit trail
- Export transactions

**Components**:
- 1 component file
- 1 template file

#### Warehouse Inventory Checker (`warehouse/inventory-checker/`)
**Route**: `/admin/warehouse/inventory-checker`
**Components**: 2

**Features**:
- Check inventory levels
- Compare expected vs actual
- Generate reports
- Export inventory data

**Components**:
- 2 template files

#### Shared Components (`warehouse/components/`)
**Components**: 2
- confirm-order.tsx
- variant-inventory-form.tsx

### Key Functionalities

1. **Inbound Workflow**
   ```
   1. Supplier order arrives
   2. Assign to handler
   3. Scan/count items
   4. Confirm receipt
   5. Update inventory
   6. Mark as complete
   ```

2. **Outbound Workflow**
   ```
   1. Order placed
   2. Assign to picker
   3. Pick items
   4. Verify quantities
   5. Pack order
   6. Create shipment
   7. Print label
   8. Mark as shipped
   ```

3. **Inventory Structure**
   ```typescript
   {
     warehouse_id: string;
     variant_id: string;
     quantity: number;
     reserved_quantity: number;
     available_quantity: number;
     location?: string;
   }
   ```

4. **Transaction Types**
   - Inbound (receiving)
   - Outbound (shipping)
   - Adjustment (manual)
   - Transfer (between warehouses)
   - Return (customer return)
   - Return to supplier

5. **Multi-Warehouse**
   - Assign inventory to warehouses
   - Transfer between warehouses
   - Warehouse-specific pricing
   - Fulfillment routing

---

# Common Patterns

## Module Structure

Each feature module typically follows this structure:

```
module-name/
├── components/
│   ├── feature-list/
│   │   └── columns.tsx
│   ├── feature-modal/
│   │   └── index.tsx
│   └── feature-detail/
│       └── sections.tsx
├── hooks/
│   └── use-feature.tsx
└── templates/
    ├── list.tsx
    └── detail.tsx
```

## Common Components

Shared across modules:
- Table with sorting/filtering
- Create/Edit modals
- Detail views with tabs
- Action menus
- Search bars
- Filters
- Pagination

## Navigation

All features accessible via:
1. **Sidebar**: Main navigation
2. **Breadcrumbs**: Current location
3. **Quick actions**: Floating button or header actions

## Permissions

Each route protected by middleware checking:
- User authentication
- User role (Admin/Member)
- User permissions (Manager/Warehouse/Driver/Accountant)

---

# Summary

The Admin Portal provides:

- ✅ **16 major modules**
- ✅ **400+ components**
- ✅ Complete e-commerce management
- ✅ Multi-user with permissions
- ✅ Multi-warehouse support
- ✅ Complete order lifecycle
- ✅ Supplier management
- ✅ Advanced discounts and pricing
- ✅ Inventory tracking
- ✅ Customer management
- ✅ Comprehensive reporting

Each module is fully integrated with the Medusa backend through custom API hooks and provides real-time updates via TanStack React Query.

---

**Last Updated**: December 2024

**Next**: See [FEATURES_KIOT.md](./FEATURES_KIOT.md) for Kiot Portal features documentation.

