// Navbar.tsx
"use client";

import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { useSession, signIn, signOut } from 'next-auth/react';

interface NavbarProps {
  toggleLibrary: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleLibrary }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-gray-800 flex justify-between items-center p-4">
      <div>
        <h1 className="max-lg:hidden text-xl font-bold">Jammin</h1>
        <button
          onClick={toggleLibrary}
          className="p-2 text-white bg-gray-700 rounded lg:hidden"
        >
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>
      </div>

      {/* Search bar */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a song"
          className="p-2 border rounded w-64 text-black bg-white"
        />
      </div>

      <div className="flex items-center space-x-4">
        {!session ? (
          <button onClick={() => signIn('spotify')} className="hover:text-gray-300">
            Login with Spotify
          </button>
        ) : (
          <button onClick={() => signOut()} className="hover:text-gray-300">
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
