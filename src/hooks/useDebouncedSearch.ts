import { useState, useEffect, useMemo } from 'react';
import { useSearchTemplates } from './useTemplates';

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
  categoryId?: string;
}

/**
 * Custom hook for debounced template search
 * Prevents excessive API calls while typing
 */
export const useDebouncedTemplateSearch = (
  initialQuery: string = '',
  options: UseDebouncedSearchOptions = {}
) => {
  const { delay = 300, minLength = 2, categoryId } = options;

  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [immediateQuery, setImmediateQuery] = useState(initialQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(immediateQuery);
    }, delay);

    return () => clearTimeout(timer);
  }, [immediateQuery, delay]);

  // Update immediate query
  const setQuery = (query: string) => {
    setImmediateQuery(query);
  };

  // React Query for search results
  const {
    data: searchResults,
    isLoading,
    error,
    isFetching,
  } = useSearchTemplates(debouncedQuery, categoryId);

  // Determine if we're showing real results or placeholder
  const isSearching = isFetching && debouncedQuery !== immediateQuery;
  const hasQuery = debouncedQuery.length >= minLength;
  const showResults = hasQuery && !isSearching;

  // Memoize results to prevent unnecessary re-renders
  const results = useMemo(() => {
    if (!showResults || !searchResults) return [];

    // Filter out premium templates for non-authenticated users
    // Note: This could be enhanced with proper auth checking
    return searchResults.filter(template => !template.is_premium);
  }, [searchResults, showResults]);

  return {
    // Query state
    query: immediateQuery,
    debouncedQuery,
    setQuery,

    // Results state
    results,
    isLoading: isLoading || isSearching,
    error,
    hasQuery,
    showResults,

    // Helper functions
    clearQuery: () => setQuery(''),
    hasResults: results.length > 0,
  };
};
