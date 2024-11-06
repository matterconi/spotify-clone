// components/PlaylistComponent.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi'; // Importing the three-dot icon
import { usePlaylistActions } from '../hooks/usePlaylistActions';
import { useSession } from 'next-auth/react'; // Adjust based on your session management

interface PlaylistComponentProps {
  playlistId: string;
  playlistName: string;
  onClick: () => void; // Function to handle playlist selection
  isOwner: boolean;
}

const PlaylistComponent: React.FC<PlaylistComponentProps> = ({
  playlistId,
  playlistName,
  onClick,
  isOwner
}) => {
  const { data: session } = useSession();
  const { rename, remove } = usePlaylistActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control dropdown visibility
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
  const [newPlaylistName, setNewPlaylistName] = useState(playlistName); // State for new playlist name

  const menuRef = useRef<HTMLDivElement>(null); // Ref for detecting outside clicks
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  // Toggle the dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Automatically save the name when pressing Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRename();
    }
  };

  // Handle renaming the playlist
  const handleRename = () => {
    if (isEditing) {
      // Save the new name
      if (
        newPlaylistName.trim() !== '' &&
        newPlaylistName !== playlistName &&
        session
      ) {
        rename(playlistId, newPlaylistName);
      }
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
      // Focus the input field after entering edit mode
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
    setIsMenuOpen(false); // Close the menu after action
  };

  // Handle deleting the playlist
  const handleDelete = () => {
    if (session) {
      remove(playlistId);
    }
    setIsMenuOpen(false); // Close the menu after action
  };

  // Handle blur event to save the name when clicking outside the input
  const handleBlur = () => {
    if (isEditing) {
      handleRename();
    }
  };

  // Handle mouse leave on the dropdown menu to close it
  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className="flex items-center justify-between p-2 hover:bg-gray-800 rounded relative"
      ref={menuRef} // Attach ref to the component
    >
      {/* Playlist Name or Edit Input */}
      {isEditing ? (
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={inputRef}
          className="p-2 w-full bg-gray-700 text-white rounded"
        />
      ) : (
        <div onClick={onClick} className="cursor-pointer hover:text-gray-300">
          {playlistName}
        </div>
      )}

      {/* Three-Dot Menu Icon */}
      <button
        onClick={toggleMenu}
        className="ml-2 focus:outline-none"
        aria-label="More options"
      >
        <FiMoreVertical className="text-gray-400 hover:text-gray-200" />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className="absolute right-[-10rem] mt-2 w-40 bg-gray-700 rounded shadow-lg z-10 transition ease-out duration-200 transform opacity-100 scale-100"
          onMouseLeave={() => setIsMenuOpen(false)} // Close the menu when mouse exits
          role="menu"
          aria-label="Playlist actions"
        >
          {isOwner ? (
            <>
              <button
                onClick={handleRename}
                className="w-full text-left px-4 py-2 hover:bg-gray-600 rounded-t focus:outline-none"
                role="menuitem"
              >
                {isEditing ? 'Save' : 'Change Name'}
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 hover:bg-gray-600 focus:outline-none"
                role="menuitem"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 hover:bg-gray-600 rounded-b focus:outline-none"
              role="menuitem"
            >
              Unfollow
            </button>
          )}
    </div>
    )}
    </div>
  );
};

export default PlaylistComponent;
