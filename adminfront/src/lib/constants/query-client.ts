import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,        // 5 minutes (was 90s)
      cacheTime: 10 * 60 * 1000,       // 10 minutes cache retention
      retry: 3,                         // Retry 3 times (was 1)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 0, // Mutations không retry để tránh tạo duplicate records
    },
  },
})
