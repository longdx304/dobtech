# Utilities Documentation

## Overview

Utility functions provide common operations used throughout the application. Located in `src/utils/` directory.

**Total Utility Files**: 13

---

## Utility Functions

### build-options.ts

**Purpose**: Build mutation options with automatic query invalidation

```typescript
export const buildOptions = <TData, TError, TVariables, TContext, TKey extends QueryKey>(
  queryClient: QueryClient,
  queryKey?: TKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext>
```

**Usage**:
```typescript
return useMutation(
  mutationFn,
  buildOptions(queryClient, [productKeys.lists()], options)
);
```

---

### countries.ts

**Purpose**: Country codes and names

---

### currencies.ts

**Purpose**: Currency definitions and configurations

```typescript
export const currencies = {
  USD: {
    code: 'USD',
    symbol_native: '$',
    name: 'US Dollar',
    decimal_digits: 2,
  },
  VND: {
    code: 'VND',
    symbol_native: '₫',
    name: 'Vietnamese Dong',
    decimal_digits: 0,
  },
  // ... more currencies
};
```

---

### fulfillment-providers.mapper.ts

**Purpose**: Map fulfillment provider IDs to display names

---

### generate-params.ts

**Purpose**: Generate URL query parameters from object

```typescript
export default function generateParams(query: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : '';
}
```

---

### get-relative-time.ts

**Purpose**: Convert date to relative time string (e.g., "2 hours ago")

---

### is-line-item.ts

**Purpose**: Type guard to check if object is a line item

---

### is-nullish-object.ts

**Purpose**: Check if object has only null/undefined values

---

### is-valid-email.ts

**Purpose**: Validate email format

```typescript
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

---

### map-address-to-form.ts

**Purpose**: Convert address object to form-compatible format

---

### payment-providers-mapper.ts

**Purpose**: Map payment provider IDs to display names

---

### prices.ts

**Purpose**: Price formatting and calculation utilities

#### Key Functions:

```typescript
// Normalize amount (divide by decimal places)
export function normalizeAmount(currency: string, amount: number): number

// Display amount with correct decimals
export function displayAmount(currency: string, amount: number): string

// Extract unit price with tax
export const extractUnitPrice = (
  item: PricedVariant,
  region: Region,
  withTax = true
): number

// Display unit price with currency
export const displayUnitPrice = (
  item: PricedVariant, 
  region: Region
): string

// Get decimal digits for currency
export function getDecimalDigits(currency: string): number

// Convert display price to persisted amount
export function persistedPrice(currency: string, amount: number): number

// Format amount with currency symbol
export function formatAmountWithSymbol({
  amount,
  currency,
  digits,
  tax = 0,
}: FormatMoneyProps): string

// Get native currency symbol
export const getNativeSymbol = (currencyCode: string): string
```

**Usage Examples**:
```typescript
// Format price
formatAmountWithSymbol({
  amount: 199900, // cents
  currency: 'VND',
}); // "₫1,999"

// Normalize amount
normalizeAmount('USD', 1999); // 19.99

// Get symbol
getNativeSymbol('VND'); // "₫"
```

---

### remove-nullish.ts

**Purpose**: Remove null/undefined properties from object

```typescript
export function removeNullish<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}
```

---

## lib/utils.ts

**Purpose**: Core utility functions

### cn()

**Purpose**: Merge Tailwind CSS class names

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:
```typescript
cn('px-4 py-2', isActive && 'bg-blue-500', className)
// Intelligently merges classes, resolving conflicts
```

### formatNumber()

**Purpose**: Format numbers with thousands separator

```typescript
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}
```

### handleErrorZod()

**Purpose**: Handle Zod validation errors

```typescript
export function handleErrorZod(result: z.SafeParseReturnType<any, any>) {
  if (!result.success) {
    return {
      result: result.error.errors[0].message,
    };
  }
  return null;
}
```

---

## Usage Patterns

### Price Display

```typescript
import { formatAmountWithSymbol } from '@/utils/prices';

const ProductPrice = ({ amount, currency }) => (
  <span>{formatAmountWithSymbol({ amount, currency })}</span>
);
```

### Class Names

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)} />
```

### Query Parameters

```typescript
import generateParams from '@/utils/generate-params';

const params = generateParams({
  limit: 20,
  offset: 0,
  status: 'published',
});
// ?limit=20&offset=0&status=published
```

---

## Testing Utilities

```typescript
import { isValidEmail } from '@/utils/is-valid-email';

describe('isValidEmail', () => {
  it('validates email correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

---

**Last Updated**: December 2024

