import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

type FilterValue = string | number | undefined | null;

/**
 * Shared hook for URL-driven filter state.
 * Provides a stable `updateFilters` that merges changes into the current
 * URLSearchParams and always resets `page` to 1 unless page itself is
 * explicitly included in the update.
 */
export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilters = useCallback(
    (updates: Record<string, FilterValue>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // Reset to page 1 whenever any filter other than page itself changes.
      if (!('page' in updates)) {
        newParams.delete('page');
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  return { searchParams, setSearchParams, updateFilters };
};
