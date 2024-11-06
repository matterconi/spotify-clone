import React from 'react';

interface PlaylistDropdownProps {
  playlists: Playlist[];
  onSelectPlaylist: (playlistId: string) => void;
}

const PlaylistDropdown: React.FC<PlaylistDropdownProps> = ({ playlists, onSelectPlaylist }) => {
  // Filter playlists to include only those owned by the user
  const ownerPlaylists = playlists.filter(playlist => playlist.isOwner);

  return (
    <div className="absolute top-full mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg text-black z-10">
      <ul className="py-2">
        {ownerPlaylists.length > 0 ? (
          ownerPlaylists.map((playlist) => (
            <li
              key={playlist.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectPlaylist(playlist.id)}
            >
              {playlist.name}
            </li>
          ))
        ) : (
          <li className="px-4 py-2 text-gray-500">No owned playlists</li>
        )}
      </ul>
    </div>
  );
};

export default PlaylistDropdown;