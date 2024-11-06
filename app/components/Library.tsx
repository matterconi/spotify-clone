// Library.tsx
"use client";

import React from 'react';
import PlaylistComponent from './Playlist';
import Skeleton from './Skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useLibraryActions } from '../hooks/useLibraryActions';

interface LibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const Library: React.FC<LibraryProps> = ({ isOpen, onClose }) => {
  const {
    playlists = [],
    newPlaylistName,
    setNewPlaylistName,
    handleFavoriteSelect,
    handlePlaylistSelect,
    handleAddPlaylist,
  } = useLibraryActions();

  const isLoadingFav = useSelector((state: RootState) => state.music.isLoading.fetchFavoriteTracks);
  const isLoadingPlay = useSelector((state: RootState) => state.music.isLoading.fetchUserPlaylists);
  const isLoadingCreate = useSelector((state: RootState) => state.music.isLoading.createPlaylist);
  const error = useSelector((state: RootState) => state.music.error);

  const ownedPlaylists = playlists.filter((playlist) => playlist.isOwner);
  const followedPlaylists = playlists.filter((playlist) => !playlist.isOwner);

  return (
    <>
      {/* Sidebar Menu */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-4 flex flex-col z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out w-full md:w-64 lg:relative lg:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">Your Library</h2>

        {/* Favorite Tracks Section */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">My Favorite Tracks</h3>
          {isLoadingFav ? (
            <Skeleton width="w-full" height="h-6" className="mb-2" />
          ) : (
            <ul>
              <li
                className="cursor-pointer hover:text-gray-300 p-2 rounded bg-gray-800"
                onClick={handleFavoriteSelect}
              >
                Favorite Tracks
              </li>
            </ul>
          )}
        </section>

        {/* Owned Playlists Section */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Playlists I Own</h3>
          {isLoadingPlay ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} width="w-full" height="h-6" />
              ))}
            </div>
          ) : ownedPlaylists.length > 0 ? (
            <ul className="space-y-2">
              {ownedPlaylists.map((playlist) => (
                <li key={playlist.id}>
                  <PlaylistComponent
                    playlistId={playlist.id}
                    playlistName={playlist.name}
                    onClick={() => handlePlaylistSelect(playlist.id)}
                    isOwner={playlist.isOwner}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You don't own any playlists.</p>
          )}
        </section>

        {/* Followed Playlists Section */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Playlists I Follow</h3>
          {isLoadingPlay ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} width="w-full" height="h-6" />
              ))}
            </div>
          ) : followedPlaylists.length > 0 ? (
            <ul className="space-y-2">
              {followedPlaylists.map((playlist) => (
                <li key={playlist.id}>
                  <PlaylistComponent
                    playlistId={playlist.id}
                    playlistName={playlist.name}
                    onClick={() => handlePlaylistSelect(playlist.id)}
                    isOwner={playlist.isOwner}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You don't follow any playlists.</p>
          )}
        </section>

        {/* Add New Playlist Section */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Create New Playlist</h3>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="New Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <button
              onClick={handleAddPlaylist}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={isLoadingCreate}
            >
              {isLoadingCreate ? 'Adding...' : 'Add Playlist'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </section>
      </aside>

      {/* Overlay for Closing Sidebar on Outside Click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Library;
