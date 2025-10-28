import { QueryClient } from '@tanstack/react-query';

// Default query options for performance optimization
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Don't refetch on window focus by default (can be overridden)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      // Retry failed requests 1 time
      retry: 1,
      // Retry delay based on attempt number
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Keep mutation data in cache briefly
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Query key factory for consistent naming
export const queryKeys = {
  // Authentication
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },

  // Profiles
  profiles: {
    all: ['profiles'] as const,
    lists: () => [...queryKeys.profiles.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.profiles.lists(), filters] as const,
    details: () => [...queryKeys.profiles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.profiles.details(), id] as const,
    user: (userId: string) => [...queryKeys.profiles.all, 'user', userId] as const,
    slug: (slug: string) => [...queryKeys.profiles.all, 'slug', slug] as const,
    default: (userId: string) => [...queryKeys.profiles.all, 'default', userId] as const,
  },

  // Templates
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.templates.lists(), filters] as const,
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.templates.details(), id] as const,
    user: (userId: string) => [...queryKeys.templates.all, 'user', userId] as const,
    categories: ['templates', 'categories'] as const,
    search: (query: string, categoryId?: string) => [
      ...queryKeys.templates.all,
      'search',
      query,
      categoryId,
    ] as const,
  },

  // Template Categories
  templateCategories: {
    all: ['template-categories'] as const,
  },

  // Profile shares
  profileShares: {
    all: ['profile-shares'] as const,
    token: (token: string) => [...queryKeys.profileShares.all, token] as const,
  },
};

// Mutation key factory
export const mutationKeys = {
  profiles: {
    create: ['profiles', 'create'] as const,
    update: ['profiles', 'update'] as const,
    delete: ['profiles', 'delete'] as const,
    share: ['profiles', 'share'] as const,
  },
  templates: {
    create: ['templates', 'create'] as const,
    update: ['templates', 'update'] as const,
    delete: ['templates', 'delete'] as const,
    rate: ['templates', 'rate'] as const,
  },
};
