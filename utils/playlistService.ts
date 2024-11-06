import { clearSearchResults, setSelectedPlaylistTracks, setSearchQuery, setPlaylists } from '../redux/musicSlice';
import { Dispatch } from 'redux';
import axios from 'axios';


export const fetchPlaylistTracks = async (playlistId: string, accessToken: string) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map((artist: any) => artist.name).join(', '),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url || '',
      previewUrl: item.track.preview_url || '',
      uri: item.track.uri,
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
};

export const createNewPlaylist = async (userId: string, playlistName: string, accessToken: string) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        public: false, // Create as a private playlist
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      name: response.data.name,
    };
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

export const handleSelectPlaylist = async (
  playlistId: string,
  accessToken: string,
  dispatch: Dispatch<any>,
  onSelectPlaylist: (playlistId: string) => void
) => {
  try {
    const tracks = await fetchPlaylistTracks(playlistId, accessToken);
    
    // Clear search results and set selected playlist tracks
    dispatch(clearSearchResults());
    dispatch(setSelectedPlaylistTracks(tracks));
    dispatch(setSearchQuery('')); // Clear search query

    // Call the onSelectPlaylist function if additional logic is required
    onSelectPlaylist(playlistId);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
  }
};

// Rename Playlist Function
export const renamePlaylist = (playlistId: string, newName: string, accessToken: string) => async (dispatch: Dispatch<any>, getState: any) => {
  try {
    await axios.put(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { name: newName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update Redux state after renaming playlist on Spotify
    const state = getState();
    const updatedPlaylists = state.music.playlists.map((playlist) =>
      playlist.id === playlistId ? { ...playlist, name: newName } : playlist
    );

    dispatch(setPlaylists(updatedPlaylists));
  } catch (error) {
    console.error('Error renaming playlist:', error);
  }
};

// Delete Playlist Function
export const deletePlaylist = (playlistId: string, accessToken: string) => async (dispatch: Dispatch<any>, getState: any) => {
  try {
    await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Remove the playlist from Redux store
    const state = getState();
    const updatedPlaylists = state.music.playlists.filter((playlist: Playlist) => playlist.id !== playlistId);

    dispatch(setPlaylists(updatedPlaylists));
  } catch (error) {
    console.error('Error deleting playlist:', error);
  }
};
