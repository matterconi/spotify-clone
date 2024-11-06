// /hooks/useMusicOnMount.ts
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '../../redux/store';
import { fetchFavoriteTracks, fetchUserPlaylists } from '@/redux/musicThunks';
import { setAccessToken } from '../../redux/authSlice';
import { setSelectedPlaylistTracks } from '@/redux/musicSlice';

export const useMusicOnMount = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeMusicData = async () => {
      // Log session data for debugging
      if (!session?.accessToken) {
        console.warn('No access token in session');
        return;
      }

      // Set accessToken in Redux, checking if it’s non-null
      if (session.accessToken) {
        dispatch(setAccessToken(session.accessToken));
      }
      try {
        // Dispatch thunks after setting accessToken in Redux
        const favorites = await dispatch(fetchFavoriteTracks()).unwrap();
        dispatch(setSelectedPlaylistTracks(favorites))
        await dispatch(fetchUserPlaylists()).unwrap();
      } catch (error) {
        console.error('Error initializing music data:', error);
      }
    };

    initializeMusicData();
    
  }, [session, dispatch]);
};
