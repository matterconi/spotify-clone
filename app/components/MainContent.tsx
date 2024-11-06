import React from 'react';

interface MainContentProps {
  tracks: { id: string; name: string; artist: string; album: string }[];
}

const MainContent: React.FC<MainContentProps> = ({ tracks }) => {
  return (
    <div className="flex-grow p-8">
      <h2 className="text-2xl font-bold mb-4">Songs</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} className="p-4 border-b">
            <div>
              <p>{track.name} by {track.artist}</p>
              <p>{track.album}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainContent;
