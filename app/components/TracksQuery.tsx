// TracksQuery.tsx

"use client";

import React from 'react';
import { AudioProvider } from '../AudioContext';
import TrackItem from './TrackItem';
import TrackControls from './TrackControls';
import { useTracksQueryActions } from '../hooks/useTracksQueryActions';
import { useAppSelector } from '../../redux/store';
import TrackSkeleton from './TrackSkeleton'; // Skeleton component

const TracksQuery: React.FC = () => {
  const {
    tracksToDisplay,
    playlists,
    favoriteTracks,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    handleToggleFavorite,
    currentPlaylistId,
  } = useTracksQueryActions();

  // Find the current playlist based on currentPlaylistId
  const currentPlaylist = useAppSelector((state) =>
    (state.music.playlists ?? []).find((playlist) => playlist.id === currentPlaylistId)
  );

  // Check if tracks are loading
  const isLoadingTracks = useAppSelector((state) => 
    state.music.isLoading.fetchPlaylistTracks
  );

  const isLoadingFavTracks = useAppSelector((state) => 
    state.music.isLoading.fetchFavoriteTracks
  );

  if (tracksToDisplay.length === 0 && isLoadingTracks) {
    return (
      <ul>
        {[...Array(5)].map((_, index) => (
          <TrackSkeleton key={index} />
        ))}
      </ul>
    );
  }

  else if (isLoadingFavTracks) {
      return (
        <ul>
          {[...Array(5)].map((_, index) => (
            <TrackSkeleton key={index} />
          ))}
        </ul>
      );
  }

  if (tracksToDisplay.length === 0) {
    return <p className="text-gray-500">No tracks available</p>;
  }
  
  return (
    <AudioProvider >
      <ul>
        {tracksToDisplay.map((track, index) => (
          <TrackItem key={index} track={track}>
            <TrackControls
              track={track}
              playlists={playlists}
              handleAddToPlaylist={handleAddToPlaylist}
              handleRemoveFromPlaylist={handleRemoveFromPlaylist}
              isFavorite={!!favoriteTracks?.find((t) => t.id === track.id)}
              handleToggleFavorite={handleToggleFavorite}
              isOwner={currentPlaylist?.isOwner ?? false} 
              currentPlaylistId={currentPlaylistId}
              index = {index}
            />
          </TrackItem>
        ))}
      </ul>
    </AudioProvider>
  );
};

export default TracksQuery;
