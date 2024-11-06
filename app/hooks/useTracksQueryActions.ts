// hooks/useTracksQueryActions.ts
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  addTrackToSpotifyPlaylist,
  removeTrackFromSpotifyPlaylist,
  toggleFavoriteTrack,
} from '../../redux/musicThunks';
import { toast } from 'react-toastify';

export const useTracksQueryActions = () => {
  const dispatch = useAppDispatch();

  const searchResults = useAppSelector((state) => state.music.searchResults);
  const playlists = useAppSelector((state) => state.music.playlists);
  const selectedPlaylistTracks = useAppSelector((state) => state.music.selectedPlaylistTracks);
  const favoriteTracks = useAppSelector((state) => state.music.favoriteTracks);
  const currentPlaylistId = useAppSelector((state) => state.music.currentPlaylistId);
  const tracksToDisplay = searchResults.length > 0 ? searchResults : selectedPlaylistTracks;

  // Handle adding a track to a playlist via thunk
  const handleAddToPlaylist = async (playlistId: string, track: any) => {
    const result = await dispatch(addTrackToSpotifyPlaylist({ playlistId, track }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Added "${track.name}" to playlist.`);
    } else {
      toast.error(`Failed to add "${track.name}" to playlist.`);
    }
  };

  // Handle removing a track from a playlist via thunk
  const handleRemoveFromPlaylist = async (playlistId: string, track: any, index: number) => {
    const result = await dispatch(removeTrackFromSpotifyPlaylist({ playlistId, track, index }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Removed all instances "${track.name}" from playlist.`);
    } else {
      toast.error(`Failed to remove "${track.name}" from playlist.`);
    }
  };

  // Handle toggling a track's favorite status via thunk
  const handleToggleFavorite = async (track: any) => {
    console.log(currentPlaylistId);
    const result = await dispatch(toggleFavoriteTrack(track));
    if (result.meta.requestStatus === 'fulfilled') {
      if (result.payload.removed) {
        toast.info(`Removed all instances of "${track.name}" from favorites.`);
      } else {
        toast.success(`Added "${track.name}" to favorites.`);
      }
    } else {
      toast.error(`Failed to update favorite status for "${track.name}".`);
    }
  };

  return {
    tracksToDisplay,
    playlists,
    selectedPlaylistTracks,
    favoriteTracks,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    handleToggleFavorite,
    currentPlaylistId, // Expose currentPlaylistId
  };
};
