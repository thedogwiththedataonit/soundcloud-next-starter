"use client";

import React from 'react';
import { useMusicPlayer } from '@/contexts/music-player-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function MusicPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    togglePlayPause,
    seekTo,
    setVolume,
  } = useMusicPlayer();

  if (!currentTrack) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-lg z-50",
        "transform transition-all duration-300 ease-in-out",
        currentTrack ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3 mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-track.jpg';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-row items-center gap-2 flex-1 max-w-md justify-center">
          {/* Play/Pause Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-8 w-8 p-0 rounded-full cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Progress Bar and Time hidden on mobile */}
          <div className="flex items-center gap-2 w-full hidden md:flex">
            <span className="text-xs text-muted-foreground tabular-nums min-w-[2.5rem]">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 group">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                className="w-full cursor-pointer"
                onValueChange={([value]) => {
                  const newTime = (value / 100) * duration;
                  seekTo(newTime);
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums min-w-[2.5rem]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <div className="w-20">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={([value]) => setVolume(value / 100)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 