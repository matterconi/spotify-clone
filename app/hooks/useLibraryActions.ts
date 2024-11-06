// hooks/useLibraryActions.ts
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { 
  setSelectedPlaylistTracks,
  setCurrentPlaylistId,  
  setSearchResults,
} from '../../redux/musicSlice';
import { 
  createPlaylist
} from '../../redux/musicThunks'; // Adjusted import for thunks
import { useFetchPlaylistTracksHook } from './useFetchPlaylistTracks';
import { toast } from 'react-toastify'; // Import toast


export const useLibraryActions = () => {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector((state) => state.music.playlists);
  const favoriteTracks = useAppSelector((state) => state.music.favoriteTracks);
  const currentPlaylistId = useAppSelector((state) => state.music.currentPlaylistId);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { fetchTracks } = useFetchPlaylistTracksHook(); // Use track fetching hook

  // Handle favorite track selection
  const handleFavoriteSelect = () => {
    dispatch(setSearchResults([]));
    dispatch(setCurrentPlaylistId(null))
    dispatch(setSelectedPlaylistTracks(favoriteTracks));
  };

  // Handle playlist selection and fetch tracks
  const handlePlaylistSelect = (playlistId: string) => {
    fetchTracks(playlistId); // No more session management needed
    dispatch(setCurrentPlaylistId(playlistId));
  };

  // Handle adding a new playlist
  const handleAddPlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        const playlistToAdd = await dispatch(createPlaylist(newPlaylistName)).unwrap(); 
        // The thunk handles adding to the state via extraReducers
        toast.success(`Playlist "${playlistToAdd.name}" created successfully!`);
        setNewPlaylistName(''); // Clear input
      } catch (error) {
        console.error('Failed to create playlist:', error);
        toast.error('Failed to create playlist.');
      }
    }
  };

  useEffect(() => {
    if (!currentPlaylistId) {
      console.log(currentPlaylistId);
      dispatch(setSelectedPlaylistTracks(favoriteTracks));
    }
  }, [favoriteTracks, dispatch])

  return {
    playlists,
    favoriteTracks,
    newPlaylistName,
    setNewPlaylistName,
    handleFavoriteSelect,
    handlePlaylistSelect,
    handleAddPlaylist,
  };
};
