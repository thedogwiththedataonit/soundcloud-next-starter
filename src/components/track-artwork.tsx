"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SoundCloudTrack } from "@/types/soundcloud";
import AudioPlayer from "./AudioPlayer";

interface TrackArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  track: SoundCloudTrack;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function TrackArtwork({
  track,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: TrackArtworkProps) {
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
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

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <img
              src={getArtworkUrl()}
              alt={track.title}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
              style={{
                width: width ? `${width}px` : "auto",
                height: height ? `${height}px` : "auto",
              }}
              onError={() => setImageError(true)}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>
            <a
              href={track.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full"
            >
              Open in SoundCloud
            </a>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Add to Queue</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      <div className="flex flex-col gap-1 text-sm">
        <h3 className="font-medium leading-none line-clamp-2">{track.title}</h3>
        <div className="flex items-center gap-2">
          <img
            src={getAvatarUrl()}
            alt={track.user.username}
            className="w-4 h-4 rounded-full"
            onError={() => setAvatarError(true)}
          />
          <p className="text-xs text-muted-foreground line-clamp-1">{track.user.username}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {formatNumber(track.playback_count)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {formatNumber(track.favoritings_count)}
          </span>
          {track.genre && (
            <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
              {track.genre}
            </span>
          )}
        </div>
      </div>
      
      {/* Audio Player */}
      <div className="mt-2">
        <AudioPlayer trackId={track.id.toString()} />
      </div>
    </div>
  );
} 