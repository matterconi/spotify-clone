import { useCallback } from 'react';
import { useAppDispatch } from '../../redux/store';
import { fetchPlaylistTracks } from '../../redux/musicThunks';

export const useFetchPlaylistTracksHook = () => {
  const dispatch = useAppDispatch();

  const fetchTracks = useCallback(
    async (playlistId: string) => {
      try {
        // Call the thunk to fetch playlist tracks
        await dispatch(fetchPlaylistTracks(playlistId));
      } catch (error) {
        console.error('Error fetching playlist tracks:', error);
      }
    },
    [dispatch]
  );

  return { fetchTracks };
};
