import React, { useState, useRef, useEffect, use } from 'react';
import {useAudio } from '../AudioContext';

interface TrackItemProps {
  track: any;
  children: React.ReactNode; // To include controls like add/remove buttons
}

const TrackItem: React.FC<TrackItemProps> = ({ track, children }) => {
  const { currentlyPlayingId, setCurrentlyPlayingId } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false); // Track play state
  const audioRef = useRef<HTMLAudioElement>(null); // Reference to the audio element

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setCurrentlyPlayingId(null); // Stop current track
      setIsPlaying(false);
    } else {
      // If there's another track playing, pause it
      if (currentlyPlayingId && currentlyPlayingId !== track.id) {
        const otherAudio = document.getElementById(`audio-${currentlyPlayingId}`) as HTMLAudioElement;
        if (otherAudio) otherAudio.pause();
      }
      console.log(audioRef, currentlyPlayingId);
      audioRef.current.play();
      setCurrentlyPlayingId(track.id); // Set this track as playing
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // If the currently playing track has changed and it's not this track, set `isPlaying` to false
    if (currentlyPlayingId !== track.id && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentlyPlayingId, isPlaying, track.id]);

  return (
    <li className="flex justify-between items-center p-4 border-b relative">
      <div className="flex items-center space-x-4">
        {track.image && (
          <img
            src={track.image}
            alt={`${track.name} album cover`}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div>
          <p className="font-semibold">{track.name}</p>
          <p className="text-sm text-gray-600">by {track.artist}</p>
          <p className="text-sm text-gray-500">{track.album}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {track.previewUrl ? (
          <div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full">
            <button onClick={handlePlayPause} className="text-gray-500">
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <audio
              ref={audioRef}
              id={`audio-${track.id}`}
              src={track.previewUrl}
              onEnded={() => setCurrentlyPlayingId(null)} // Reset when audio ends
              className="hidden"
            />
          </div>
        ) : (
          <p className="text-gray-500">No preview available</p>
        )}

        {children}
      </div>
    </li>
  );
};

export default TrackItem;