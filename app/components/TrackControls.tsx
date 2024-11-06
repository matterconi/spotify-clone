// components/TrackControls.tsx

import React, { useState } from 'react';
import PlaylistDropdown from './PlaylistDropdown';

interface TrackControlsProps {
  track: any;
  playlists: any[];
  handleAddToPlaylist: (playlistId: string, track: any) => void;
  handleRemoveFromPlaylist: (playlistId: string, track: any) => void;
  isFavorite: boolean;
  handleToggleFavorite: (track: any) => void;
  isOwner: boolean; // New prop to check ownership
  currentPlaylistId?: string; // Optional prop to know which playlist is current
  index: number;
}

const TrackControls: React.FC<TrackControlsProps> = ({
  track,
  playlists,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
  isFavorite,
  handleToggleFavorite,
  isOwner, // Destructure isOwner
  currentPlaylistId, // Destructure currentPlaylistId
  index
}) => {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  const handleAddClick = () => {
    setShowPlaylistMenu((prev) => !prev);
  };

  const handleSelectPlaylist = (playlistId: string) => {
    handleAddToPlaylist(playlistId, track);
    setShowPlaylistMenu(false);
  };

  return (
    <>
      <div className="flex space-x-4">
        {/* Toggle favorite button */}
        <button onClick={() => handleToggleFavorite(track)}>
          {isFavorite ? (
            <span className="text-red-500">♥</span> // Filled heart if favorite
          ) : (
            <span className="text-gray-500">♡</span> // Empty heart if not favorite
          )}
        </button>

        {isOwner && currentPlaylistId ? (
          <button
            onClick={() => handleRemoveFromPlaylist(currentPlaylistId, track, index)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove from Playlist
          </button>
        ) : (
          <>
            <button
              onClick={handleAddClick}
              className="bg-green-500 text-white px-4 py-2 rounded relative"
            >
              Add to Playlist
            </button>
            {showPlaylistMenu && (
              <PlaylistDropdown
                playlists={playlists}
                onSelectPlaylist={handleSelectPlaylist}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TrackControls;
