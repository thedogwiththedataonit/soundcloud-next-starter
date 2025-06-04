"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { SelectedTrack } from '@/lib/types';

interface MusicPlayerState {
  currentTrack: SelectedTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

interface MusicPlayerContextType extends MusicPlayerState {
  setCurrentTrack: (track: SelectedTrack) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlay = useRef(false);

  const setCurrentTrack = useCallback((track: SelectedTrack) => {
    shouldAutoPlay.current = true; // Flag to auto-play when audio is ready
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isLoading: true,
    }));
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration || 0, isLoading: false }));
    };

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
      // Auto-play when audio is ready and we just set a new track
      if (shouldAutoPlay.current) {
        shouldAutoPlay.current = false;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error auto-playing audio:', error);
          });
        }
      }
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleError = () => {
      console.error('Audio error occurred');
      setState(prev => ({ ...prev, isLoading: false, isPlaying: false }));
      shouldAutoPlay.current = false;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [state.currentTrack]);

  const contextValue: MusicPlayerContextType = {
    ...state,
    setCurrentTrack,
    play,
    pause,
    togglePlayPause,
    seekTo,
    setVolume,
    audioRef,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
      {/* Hidden audio element */}
      {state.currentTrack && (
        <audio
          ref={audioRef}
          src={state.currentTrack.audioUrl}
          preload="metadata"
        />
      )}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
} 