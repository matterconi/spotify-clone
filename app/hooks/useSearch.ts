// /hooks/useSearch.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setSearchQuery } from '../../redux/musicSlice';
import { fetchSearchResults } from '../../redux/musicThunks'; // Import the thunk

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.music.searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(fetchSearchResults(searchQuery)); // Dispatch the thunk to fetch results
      }
    }, 300);

    return () => clearTimeout(handler); // Cleanup timeout on unmount or re-render
  }, [dispatch, searchQuery]);

  const updateSearchQuery = (query: string) => {
    dispatch(setSearchQuery(query)); // Update search query in Redux state
  };

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
  };
};
