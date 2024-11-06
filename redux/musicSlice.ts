import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  fetchFavoriteTracks,
  fetchCurrentUserId,
  fetchUserPlaylists,
  fetchPlaylistTracks,
  createPlaylist,
  addTrackToSpotifyPlaylist,
  removeTrackFromSpotifyPlaylist,
  toggleFavoriteTrack,
  renamePlaylistThunk,
  deletePlaylistThunk,
  fetchSearchResults,
} from './musicThunks'; // Import your thunks

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  previewUrl: string;
  uri: string;
}

interface Playlist {
  id: string;
  name: string;
  isOwner: boolean;
  ownerId: string;
  public: boolean;
  collaborative: boolean;
}

interface LoadingState {
  fetchFavoriteTracks: boolean;
  fetchUserPlaylists: boolean;
  fetchPlaylistTracks: boolean;
  createPlaylist: boolean;
  addTrackToPlaylist: boolean;
  removeTrackFromPlaylist: boolean;
  toggleFavoriteTrack: boolean;
  renamePlaylist: boolean;
  deletePlaylist: boolean;
  fetchSearchResults: boolean;
  fetchCurrentUserId: boolean,
}
interface MusicState {
  searchResults: Track[];
  selectedPlaylistTracks: Track[];
  playlists: Playlist[];
  favoriteTracks: Track[];
  searchQuery: string;
  currentPlaylistId: string | null;
  isLoading: LoadingState;
  error: string | null;
}


const initialState: MusicState = {
  searchResults: [],
  selectedPlaylistTracks: [],
  playlists: [],
  favoriteTracks: [],
  searchQuery: '',
  currentPlaylistId: null,
  isLoading: {
    fetchFavoriteTracks: true,
    fetchUserPlaylists: true,
    fetchPlaylistTracks: true,
    createPlaylist: false,
    addTrackToPlaylist: false,
    removeTrackFromPlaylist: false,
    toggleFavoriteTrack: false,
    renamePlaylist: false,
    deletePlaylist: false,
    fetchSearchResults: false,
    fetchCurrentUserId: true,
  },
  error: null,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<Track[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedPlaylistTracks: (state, action: PayloadAction<Track[]>) => {
      state.selectedPlaylistTracks = action.payload;
      state.searchQuery = '';
    },
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
    },
    setCurrentPlaylistId: (state, action: PayloadAction<string | null>) => {
      state.currentPlaylistId = action.payload;
    },
    removeTrackFromPlaylist: (state, action: PayloadAction<Track>) => {
      state.selectedPlaylistTracks = state.selectedPlaylistTracks.filter(
        (track) => track.id !== action.payload.id
      );
    },
    setFavoriteTracks: (state, action: PayloadAction<Track[]>) => {
      state.favoriteTracks = action.payload;
    },
    addFavoriteTrack: (state, action: PayloadAction<Track>) => {
      state.favoriteTracks.unshift(action.payload);
    },
    removeFavoriteTrack: (state, action: PayloadAction<string>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track.id !== action.payload
      );
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSelectedPlaylistTracks: (state) => {
      state.selectedPlaylistTracks = [];
    },
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch favorite tracks
    builder
      .addCase(fetchFavoriteTracks.pending, (state) => {
        state.isLoading.fetchFavoriteTracks = true;
        state.error = null;
      })
      .addCase(fetchFavoriteTracks.fulfilled, (state, action) => {
        state.isLoading.fetchFavoriteTracks = false;
        state.favoriteTracks = action.payload;
      })
      .addCase(fetchFavoriteTracks.rejected, (state, action) => {
        state.isLoading.fetchFavoriteTracks = false;
        state.error = action.error.message || 'Failed to fetch favorite tracks';
      });
  
    // Fetch current user ID
    builder
      .addCase(fetchCurrentUserId.pending, (state) => {
        state.isLoading.fetchCurrentUserId = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserId.fulfilled, (state) => {
        state.isLoading.fetchCurrentUserId = false;
      })
      .addCase(fetchCurrentUserId.rejected, (state, action) => {
        state.isLoading.fetchCurrentUserId = false;
        state.error = action.error.message || 'Failed to fetch user ID';
      });
  
    // Fetch user playlists
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.isLoading.fetchUserPlaylists = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.isLoading.fetchUserPlaylists = false;
        state.playlists = action.payload;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.isLoading.fetchUserPlaylists = false;
        state.error = action.error.message || 'Failed to fetch playlists';
      });
  
    // Fetch playlist tracks
    builder
      .addCase(fetchPlaylistTracks.pending, (state) => {
        state.isLoading.fetchPlaylistTracks = true;
        state.error = null;
      })
      .addCase(fetchPlaylistTracks.fulfilled, (state, action) => {
        state.isLoading.fetchPlaylistTracks = false;
        state.selectedPlaylistTracks = action.payload;
      })
      .addCase(fetchPlaylistTracks.rejected, (state, action) => {
        state.isLoading.fetchPlaylistTracks = false;
        state.error = action.error.message || 'Failed to fetch playlist tracks';
      });
  
    // Create a new playlist
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.isLoading.createPlaylist = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.isLoading.createPlaylist = false;
        state.playlists.unshift(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isLoading.createPlaylist = false;
        state.error = action.error.message || 'Failed to create playlist';
      });
  
    // Add track to a playlist
    builder
      .addCase(addTrackToSpotifyPlaylist.pending, (state) => {
        state.isLoading.addTrackToPlaylist = true;
        state.error = null;
      })
      .addCase(addTrackToSpotifyPlaylist.fulfilled, (state) => {
        state.isLoading.addTrackToPlaylist = false;
      })
      .addCase(addTrackToSpotifyPlaylist.rejected, (state, action) => {
        state.isLoading.addTrackToPlaylist = false;
        state.error = action.error.message || 'Failed to add track';
      });
  
    // Remove track from a playlist
    builder
      .addCase(removeTrackFromSpotifyPlaylist.pending, (state) => {
        state.isLoading.removeTrackFromPlaylist = true;
        state.error = null;
      })
      .addCase(removeTrackFromSpotifyPlaylist.fulfilled, (state) => {
        state.isLoading.removeTrackFromPlaylist = false;
      })
      .addCase(removeTrackFromSpotifyPlaylist.rejected, (state, action) => {
        state.isLoading.removeTrackFromPlaylist = false;
        state.error = action.error.message || 'Failed to remove track';
      });
  
    // Toggle favorite track
    builder
      .addCase(toggleFavoriteTrack.pending, (state) => {
        state.isLoading.toggleFavoriteTrack = true;
        state.error = null;
      })
      .addCase(toggleFavoriteTrack.fulfilled, (state, action) => {
        state.isLoading.toggleFavoriteTrack = false;
        if (action.payload.removed) {
          state.favoriteTracks = state.favoriteTracks.filter(
            (track) => track.id !== action.payload.track.id
          );
        } else {
          state.favoriteTracks.unshift(action.payload.track);
        }
      })
      .addCase(toggleFavoriteTrack.rejected, (state, action) => {
        state.isLoading.toggleFavoriteTrack = false;
        state.error = action.error.message || 'Failed to toggle favorite track';
      });
  
    // Rename playlist
    builder
      .addCase(renamePlaylistThunk.pending, (state) => {
        state.isLoading.renamePlaylist = true;
        state.error = null;
      })
      .addCase(renamePlaylistThunk.fulfilled, (state, action) => {
        state.isLoading.renamePlaylist = false;
        const { playlistId, newName } = action.payload;
        const playlist = state.playlists.find((p) => p.id === playlistId);
        if (playlist) {
          playlist.name = newName;
        }
      })
      .addCase(renamePlaylistThunk.rejected, (state, action) => {
        state.isLoading.renamePlaylist = false;
        state.error = action.error.message || 'Failed to rename playlist';
      });
  
    // Delete playlist
    builder
      .addCase(deletePlaylistThunk.pending, (state) => {
        state.isLoading.deletePlaylist = true;
        state.error = null;
      })
      .addCase(deletePlaylistThunk.fulfilled, (state, action) => {
        state.isLoading.deletePlaylist = false;
        state.playlists = state.playlists.filter(
          (playlist) => playlist.id !== action.payload
        );
      })
      .addCase(deletePlaylistThunk.rejected, (state, action) => {
        state.isLoading.deletePlaylist = false;
        state.error = action.error.message || 'Failed to delete playlist';
      });
  
    // Fetch search results
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading.fetchSearchResults = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading.fetchSearchResults = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading.fetchSearchResults = false;
        state.error = action.error.message || 'Failed to fetch search results';
      });
  },
  
});

export const {
  setSearchResults,
  setSearchQuery,
  setSelectedPlaylistTracks,
  setPlaylists,
  setCurrentPlaylistId,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  setFavoriteTracks,
  addFavoriteTrack,
  removeFavoriteTrack,
  clearSearchResults,
  clearSelectedPlaylistTracks,
  addPlaylist,
} = musicSlice.actions;

export default musicSlice.reducer;
