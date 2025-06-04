'use client';
import { SoundCloudTrack } from '@/types/soundcloud';
import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/contexts/music-player-context';
import { convertToSelectedTrack } from '@/lib/track-utils';

interface TrackCardProps {
  track: SoundCloudTrack;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return '';
  }
}

export default function TrackCard({ track }: TrackCardProps) {
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause } = useMusicPlayer();
  
  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.trackId === track.id.toString();
  const showPlayingState = isCurrentTrack && isPlaying;
  
  // Get the best available artwork URL
  const getArtworkUrl = () => {
    if (imageError) {
      return avatarError ? '/placeholder-track.jpg' : track.user.avatar_url;
    }
    if (track.artwork_url) {
      return track.artwork_url.replace('large', 't300x300');
    }
    return track.user.avatar_url || '/placeholder-track.jpg';
  };

  const getAvatarUrl = () => {
    return avatarError ? '/placeholder-avatar.jpg' : (track.user.avatar_url || '/placeholder-avatar.jpg');
  };

  const handlePlayClick = async () => {
    if (isCurrentTrack) {
      // If this track is already selected, just toggle play/pause
      togglePlayPause();
    } else {
      // If this is a new track, load it
      try {
        setIsLoading(true);
        const selectedTrack = await convertToSelectedTrack(track);
        setCurrentTrack(selectedTrack);
      } catch (error) {
        console.error('Failed to play track:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="flex p-4">
        {/* Artwork */}
        <div className="flex-shrink-0 mr-4 relative">
          <img
            src={getArtworkUrl()}
            alt={track.title}
            className="w-20 h-20 rounded-lg object-cover bg-gray-200"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handlePlayClick}
              size="sm"
              className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : showPlayingState ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 ml-0.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold truncate transition-colors ${
                isCurrentTrack ? 'text-orange-600' : 'text-gray-900'
              }`}>
                <button
                  onClick={handlePlayClick}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  {track.title}
                </button>
              </h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <img
                  src={getAvatarUrl()}
                  alt={track.user.username}
                  className="w-4 h-4 rounded-full mr-2"
                  onError={() => setAvatarError(true)}
                />
                <a
                  href={track.user.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors"
                >
                  {track.user.username}
                </a>
                {track.user.city && (
                  <span className="text-gray-400 ml-2">• {track.user.city}</span>
                )}
              </p>
            </div>
            <div className="text-sm text-gray-500 ml-4 text-right">
              <div>{formatDuration(track.duration)}</div>
              {track.created_at && (
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(track.created_at)}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {track.description && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {track.description.length > 100
                ? `${track.description.substring(0, 100)}...`
                : track.description}
            </p>
          )}

          {/* Stats and Genre */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {formatNumber(track.playback_count)}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {formatNumber(track.favoritings_count)}
              </span>
              {track.comment_count > 0 && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {formatNumber(track.comment_count)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {track.genre && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {track.genre}
                </span>
              )}
              {isCurrentTrack && (
                <div className="flex items-center text-orange-600 text-xs">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-1 animate-pulse" />
                  {showPlayingState ? 'Playing' : 'Paused'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 