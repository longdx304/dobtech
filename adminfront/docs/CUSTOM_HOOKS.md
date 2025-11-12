# Custom Hooks Documentation

## Overview

Custom React hooks provide reusable logic for common UI patterns. Located in `src/lib/hooks/` directory (non-API hooks).

**Total Custom Hooks**: 6

---

## Hooks

### useIsDesktop

**Location**: `src/lib/hooks/useIsDesktop.tsx`

**Purpose**: Detect desktop screen size

```typescript
const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
};
```

**Usage**:
```typescript
import useIsDesktop from '@/lib/hooks/useIsDesktop';

const MyComponent = () => {
  const isDesktop = useIsDesktop();
  
  return (
    <div>
      {isDesktop ? <DesktopView /> : <MobileView />}
    </div>
  );
};
```

**Breakpoint**: 1024px (Tailwind 'lg' breakpoint)

---

### useIsFetching

**Location**: `src/lib/hooks/useIsFetching.tsx`

**Purpose**: Track global fetching state

**Usage**:
```typescript
import { useIsFetching } from '@/lib/hooks/useIsFetching';

const LoadingIndicator = () => {
  const isFetching = useIsFetching();
  
  if (!isFetching) return null;
  
  return <Spinner />;
};
```

---

### useToggleState

**Location**: `src/lib/hooks/use-toggle-state.tsx`

**Purpose**: Simple boolean state toggle

```typescript
const useToggleState = (initialState = false) => {
  const [state, setState] = useState(initialState);
  
  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);
  
  const setTrue = useCallback(() => {
    setState(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setState(false);
  }, []);
  
  return {
    state,
    toggle,
    setTrue,
    setFalse,
    setState,
  };
};
```

**Usage**:
```typescript
import useToggleState from '@/lib/hooks/use-toggle-state';

const MyComponent = () => {
  const { state: isOpen, toggle, setFalse } = useToggleState(false);
  
  return (
    <>
      <Button onClick={toggle}>Toggle Modal</Button>
      <Modal open={isOpen} onClose={setFalse}>
        Content
      </Modal>
    </>
  );
};
```

---

### useIsMe

**Location**: `src/lib/hooks/use-is-me.tsx`

**Purpose**: Check if user ID matches current user

```typescript
import { useUser } from '@/lib/providers/user-provider';

const useIsMe = (userId: string): boolean => {
  const { user } = useUser();
  return user?.id === userId;
};
```

**Usage**:
```typescript
import useIsMe from '@/lib/hooks/use-is-me';

const UserActions = ({ userId }) => {
  const isMe = useIsMe(userId);
  
  if (!isMe) return null;
  
  return <Button>Edit Profile</Button>;
};
```

---

### useObserveWidth

**Location**: `src/lib/hooks/use-observe-width.ts`

**Purpose**: Observe element width changes

```typescript
const useObserveWidth = (ref: RefObject<HTMLElement>) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setWidth(entry.contentRect.width);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return width;
};
```

**Usage**:
```typescript
import { useRef } from 'react';
import useObserveWidth from '@/lib/hooks/use-observe-width';

const ResponsiveComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useObserveWidth(containerRef);
  
  return (
    <div ref={containerRef}>
      Container width: {width}px
      {width < 600 && <MobileLayout />}
      {width >= 600 && <DesktopLayout />}
    </div>
  );
};
```

---

### useScrollDirection

**Location**: `src/lib/hooks/useScrollDirection.ts`

**Purpose**: Detect scroll direction

```typescript
type ScrollDirection = 'up' | 'down' | null;

const useScrollDirection = (): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return scrollDirection;
};
```

**Usage**:
```typescript
import useScrollDirection from '@/lib/hooks/useScrollDirection';

const StickyHeader = () => {
  const scrollDirection = useScrollDirection();
  
  return (
    <header 
      className={cn(
        'sticky top-0 transition-transform',
        scrollDirection === 'down' && '-translate-y-full'
      )}
    >
      Header Content
    </header>
  );
};
```

---

## Creating Custom Hooks

### Pattern for UI Hooks

```typescript
// useModal.ts
import { useState, useCallback } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
```

### Pattern for Data Hooks

```typescript
// useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```

---

## Best Practices

1. **Start with "use"**: Hook names must start with "use"
2. **Single responsibility**: Each hook should do one thing well
3. **Cleanup effects**: Always cleanup event listeners and subscriptions
4. **Memoize callbacks**: Use `useCallback` for returned functions
5. **Type safety**: Provide TypeScript types for parameters and returns
6. **Document usage**: Include JSDoc comments and examples

---

## Common Patterns

### Debounced Value

```typescript
const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

### Previous Value

```typescript
const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
```

### Media Query

```typescript
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
```

---

**Last Updated**: December 2024

**Related Documentation**:
- [API Hooks](./API_HOOKS.md) - API data fetching hooks
- [Providers](./PROVIDERS.md) - Context providers

