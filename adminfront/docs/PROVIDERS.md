# Providers Documentation

## Overview

React Context providers manage global state and provide functionality across the application. Located in `src/lib/providers/` directory.

**Total Providers**: 8

---

## Providers

### MedusaProvider

**Location**: `src/lib/providers/medusa-provider.tsx`

**Purpose**: Integrates Medusa.js with React Query

```typescript
import { MedusaProvider as Provider } from "medusa-react"
import { queryClient } from "../constants/query-client"
import { BACKEND_URL } from "../constants/medusa-backend-url"

export const MedusaProvider = ({ children }: PropsWithChildren) => {
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

**Features**:
- Wraps entire app
- Provides Medusa client
- Configures React Query
- Manages API base URL

**Usage**:
```typescript
// app/layout.tsx
import { MedusaProvider } from '@/lib/providers/medusa-provider';

<MedusaProvider>
  {children}
</MedusaProvider>
```

---

### UserProvider

**Location**: `src/lib/providers/user-provider.tsx`

**Purpose**: Manages current user session

```typescript
type UserContextType = {
  user: Omit<User, 'password_hash'> | undefined;
  isLoading: boolean;
  remove: () => void;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { user, isLoading, remove, isError } = useAdminGetSession();
  
  if (isError) {
    removeCookie();
    router.push(ERoutes.LOGIN);
    return;
  }

  return (
    <UserContext.Provider value={{ user, isLoading, remove }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

**Features**:
- Current user data
- Loading state
- Logout function
- Auto-redirect on error

**Usage**:
```typescript
import { useUser } from '@/lib/providers/user-provider';

const MyComponent = () => {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <Spinner />;
  
  return <div>Welcome, {user.first_name}!</div>;
};
```

---

### FeatureFlagProvider

**Location**: `src/lib/providers/feature-flag-provider.tsx`

**Purpose**: Manages feature flags

**Usage**:
```typescript
<FeatureFlagProvider>
  {children}
</FeatureFlagProvider>
```

---

### ImportRefresh

**Location**: `src/lib/providers/import-refresh.tsx`

**Purpose**: Refreshes data after imports

**Features**:
- Listens for import completion
- Invalidates relevant queries
- Shows import progress

---

### LayeredModalProvider

**Location**: `src/lib/providers/layer-modal-provider.tsx`

**Purpose**: Manages stacked modals

**Features**:
- Multiple modals support
- Z-index management
- Modal stacking
- Close on backdrop

**Usage**:
```typescript
<LayeredModalProvider>
  {children}
</LayeredModalProvider>
```

---

### PollingProvider

**Location**: `src/lib/providers/polling-provider.tsx`

**Purpose**: Provides real-time updates via polling

**Features**:
- Configurable interval
- Auto-start/stop
- Query refetching

**Usage**:
```typescript
<PollingProvider interval={30000}>
  {children}
</PollingProvider>
```

---

### ProductUnitProvider

**Location**: `src/lib/providers/product-unit-provider.tsx`

**Purpose**: Manages product unit context

**Features**:
- Unit definitions
- Unit conversions
- Global unit access

---

### SteppedModalProvider

**Location**: `src/lib/providers/stepped-modal-provider.tsx`

**Purpose**: Multi-step modal workflows

**Features**:
- Step management
- Navigation between steps
- Progress tracking
- Step validation

---

## Provider Hierarchy

```typescript
<AntdRegistry>
  <ConfigProvider theme={theme}>
    <MedusaProvider>
      <UserProvider>
        <FeatureFlagProvider>
          <PollingProvider>
            <ImportRefresh>
              <LayeredModalProvider>
                <ProductUnitProvider>
                  <SteppedModalProvider>
                    {children}
                  </SteppedModalProvider>
                </ProductUnitProvider>
              </LayeredModalProvider>
            </ImportRefresh>
          </PollingProvider>
        </FeatureFlagProvider>
      </UserProvider>
    </MedusaProvider>
  </ConfigProvider>
</AntdRegistry>
```

---

## Creating Custom Providers

```typescript
'use client';
import React, { createContext, useContext, PropsWithChildren } from 'react';

type MyContextType = {
  value: string;
  setValue: (value: string) => void;
};

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider = ({ children }: PropsWithChildren) => {
  const [value, setValue] = React.useState('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

---

**Last Updated**: December 2024

