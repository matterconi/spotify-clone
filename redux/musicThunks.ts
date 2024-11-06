import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store'; // Import the RootState type
import {
  setFavoriteTracks,
  setPlaylists,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  addFavoriteTrack,
  removeFavoriteTrack,
  clearSearchResults,
  setSelectedPlaylistTracks,
  setSearchResults,
  addPlaylist
} from './musicSlice';

// Helper to get access token from state
const getAccessToken = (state: RootState) => state.auth.accessToken;

export const fetchFavoriteTracks = createAsyncThunk(
    'music/fetchFavoriteTracks',
    async (_, { dispatch, getState, rejectWithValue }) => {
      const accessToken = getAccessToken(getState());
      if (!accessToken) return rejectWithValue('No access token available');
  
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const tracks = response.data.items.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((a: any) => a.name).join(', '),
          album: item.track.album.name,
          image: item.track.album.images[0]?.url || '',
          previewUrl: item.track.preview_url || '',
          uri: item.track.uri,
        }));
  
        return tracks;
      } catch (error) {
        console.error('Error fetching favorite tracks:', error);
        return rejectWithValue('Failed to fetch favorite tracks');
      }
    }
  );
  
  // Fetch Current User ID
  export const fetchCurrentUserId = createAsyncThunk(
    'auth/fetchCurrentUserId',
    async (_, { getState, rejectWithValue }) => {
      const accessToken = getAccessToken(getState());
      if (!accessToken) return rejectWithValue('No access token available');
  
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        return response.data.id;
      } catch (error) {
        console.error('Error fetching user ID:', error);
        return rejectWithValue('Failed to fetch user ID');
      }
    }
  );
  
  // Fetch User Playlists
  export const fetchUserPlaylists = createAsyncThunk(
    'music/fetchUserPlaylists',
    async (_, { dispatch, getState, rejectWithValue }) => {
      const accessToken = getAccessToken(getState());
      if (!accessToken) return rejectWithValue('No access token available');
  
      try {
        const userId = await dispatch(fetchCurrentUserId()).unwrap();
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const playlists = response.data.items.map((playlist: any) => ({
          id: playlist.id,
          name: playlist.name,
          owner: playlist.owner.id,
          public: playlist.public,
          collaborative: playlist.collaborative,
          isOwner: playlist.owner.id === userId,
        }));
        dispatch(setPlaylists(playlists));
        return playlists;
      } catch (error) {
        console.error('Error fetching playlists:', error);
        return rejectWithValue('Failed to fetch playlists');
      }
    }
  );

// Fetch Playlist Tracks
export const fetchPlaylistTracks = createAsyncThunk(
  'music/fetchPlaylistTracks',
  async (playlistId: string, { dispatch, getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken;

    if (!accessToken) {
      console.error('No access token available');
      return rejectWithValue('No access token');
    }

    try {
      // Start with an empty selected playlist to indicate a fresh load
      dispatch(setSelectedPlaylistTracks([]));
      dispatch(clearSearchResults());
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const tracks = response.data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((artist: any) => artist.name).join(', '),
        album: item.track.album.name,
        image: item.track.album.images[0]?.url || '',
        previewUrl: item.track.preview_url || '',
        uri: item.track.uri,
      }));
      dispatch(setSelectedPlaylistTracks(tracks));
      return tracks;
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      return rejectWithValue('Failed to fetch playlist tracks');
    }
  }
);

// Create Playlist
export const createPlaylist = createAsyncThunk(
  'music/createPlaylist',
  async (name: string, { dispatch, getState, rejectWithValue }) => {
    const accessToken = getAccessToken(getState());
    const ownerId = getState().auth.user?.id;
    if (!accessToken || !ownerId) return rejectWithValue('No access token or user ID available');

    try {
      const response = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        { name, public: false },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newPlaylist = {
        id: response.data.id,
        name: response.data.name,
        isOwner: true,
        ownerId,
        public: response.data.public,
        collaborative: response.data.collaborative,
      };
      return newPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return rejectWithValue('Failed to create playlist');
    }
  }
);

// Add Track to Playlist
export const addTrackToSpotifyPlaylist = createAsyncThunk(
  'music/addTrackToSpotifyPlaylist',
  async (
    { playlistId, track }: { playlistId: string; track: any },
    { getState, rejectWithValue }
  ) => {
    const accessToken = getAccessToken(getState());

    if (!accessToken) return rejectWithValue('No access token available');

    try {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [track.uri] },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      return rejectWithValue('Failed to add track');
    }
  }
);

// Remove Track from Playlist
export const removeTrackFromSpotifyPlaylist = createAsyncThunk(
  'music/removeTrackFromSpotifyPlaylist',
  async (
    { playlistId, track, index }: { playlistId: string; track: any, index: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    const accessToken = getAccessToken(getState());

    if (!accessToken) return rejectWithValue('No access token available');

    try {
      await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { tracks: [{ uri: track.uri }] },
      });

      dispatch(removeTrackFromPlaylist(track));
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      return rejectWithValue('Failed to remove track');
    }
  }
);

// Toggle Favorite Track
export const toggleFavoriteTrack = createAsyncThunk(
  'music/toggleFavoriteTrack',
  async (track: any, { dispatch, getState, rejectWithValue }) => {
    const accessToken = getAccessToken(getState());

    if (!accessToken) return rejectWithValue('No access token available');

    const isFavorite = getState().music.favoriteTracks.some(
      (favorite: any) => favorite.id === track.id
    );

    const url = 'https://api.spotify.com/v1/me/tracks';
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      if (isFavorite) {
        await axios.delete(url, { headers, data: { ids: [track.id] } });
        return { track, removed: true };
      } else {
        await axios.put(url, { ids: [track.id] }, { headers });
        return { track, added: true };
      }
    } catch (error) {
      console.error('Error toggling favorite track:', error);
      return rejectWithValue('Failed to toggle favorite track');
    }
  }
);

// Rename Playlist Thunk
export const renamePlaylistThunk = createAsyncThunk(
    'music/renamePlaylist',
    async (
      { playlistId, newName }: { playlistId: string; newName: string },
      { getState, rejectWithValue }
    ) => {
      const accessToken = getAccessToken(getState());
  
      if (!accessToken) return rejectWithValue('No access token available');
  
      try {
        await axios.put(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          { name: newName },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
  
        // Optionally update the playlist name in Redux state
        // Here you can fetch and dispatch updated playlists
        return { playlistId, newName };
      } catch (error) {
        console.error('Error renaming playlist:', error);
        return rejectWithValue('Failed to rename playlist');
      }
    }
  );
  
  // Delete Playlist Thunk
export const deletePlaylistThunk = createAsyncThunk(
'music/deletePlaylist',
async (playlistId: string, { getState, rejectWithValue }) => {
    const accessToken = getAccessToken(getState());

    if (!accessToken) return rejectWithValue('No access token available');

    try {
    await axios.delete(
        `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
        {
        headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    // Optionally fetch the updated playlists after deletion
    return playlistId;
    } catch (error) {
    console.error('Error deleting playlist:', error);
    return rejectWithValue('Failed to delete playlist');
    }
}
);

export const fetchSearchResults = createAsyncThunk(
    'music/fetchSearchResults',
    async (query: string, { dispatch, getState, rejectWithValue }) => {
      const accessToken = getAccessToken(getState());
  
      if (!accessToken) {
        console.error('No access token available');
        return rejectWithValue('No access token');
      }
  
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          params: { q: query, type: 'track', limit: 10 },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const tracks = response.data.tracks.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          artist: item.artists.map((artist: any) => artist.name).join(', '),
          album: item.album.name,
          image: item.album.images[0]?.url || '',
          previewUrl: item.preview_url || '',
          uri: item.uri,
        }));
  
        dispatch(setSearchResults(tracks)); // Dispatch search results to Redux
        return tracks; // Return tracks for further processing if needed
      } catch (error) {
        console.error('Error fetching search results:', error);
        return rejectWithValue('Failed to fetch search results');
      }
    }
);
