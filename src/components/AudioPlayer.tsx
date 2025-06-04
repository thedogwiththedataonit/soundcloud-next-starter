'use client';

import { getStream } from "@/app/actions";
import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Download, Loader2, Pause, Play } from "lucide-react";

export default function AudioPlayer({ trackId }: { trackId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (waveformRef.current && !wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ff5500',
                progressColor: '#cc4400',
                cursorColor: '#ffffff',
                barWidth: 2,
                barRadius: 1,
                height: 40,
                normalize: true,
                backend: 'WebAudio',
                interact: true,
            });

            wavesurferRef.current.on('ready', () => {
                if (wavesurferRef.current) {
                    setDuration(wavesurferRef.current.getDuration());
                    // Auto play on first load
                    wavesurferRef.current.play();
                    setIsPlaying(true);
                    setIsLoading(false);
                }
            });

            wavesurferRef.current.on('play', () => {
                setIsPlaying(true);
            });

            wavesurferRef.current.on('pause', () => {
                setIsPlaying(false);
            });

            wavesurferRef.current.on('finish', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });

            wavesurferRef.current.on('audioprocess', () => {
                if (wavesurferRef.current) {
                    setCurrentTime(wavesurferRef.current.getCurrentTime());
                }
            });

            wavesurferRef.current.on('seeking', () => {
                if (wavesurferRef.current) {
                    setCurrentTime(wavesurferRef.current.getCurrentTime());
                }
            });
        }

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }
        };
    }, []);

    const handlePlayPause = async () => {
        if (!audioUrl) {
            // First time - load and play
            setIsLoading(true);
            try {
                const url = await getStream(trackId);
                if (url && wavesurferRef.current) {
                    setAudioUrl(url);
                    await wavesurferRef.current.load(url);
                    // Auto-play will happen in the 'ready' event
                }
            } catch (error) {
                console.error('Error loading audio:', error);
                setIsLoading(false);
            }
        } else if (wavesurferRef.current) {
            // Audio already loaded - toggle play/pause
            wavesurferRef.current.playPause();
        }
    };

    const handleDownload = async () => {
        if (!audioUrl) {
            // Need to load audio URL first
            setIsLoading(true);
            try {
                const url = await getStream(trackId);
                if (url) {
                    setAudioUrl(url);
                    downloadAudio(url);
                }
            } catch (error) {
                console.error('Error loading audio for download:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            downloadAudio(audioUrl);
        }
    };

    const downloadAudio = async (url: string) => {
        setIsDownloading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `track-${trackId}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading audio:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-3">
                {/* Play/Pause Button */}
                <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-200 transform hover:scale-105
                        ${isLoading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl'
                        }
                    `}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                    ) : (
                        <Play className="w-4 h-4 text-white" />
                    )}
                </button>

                {/* Waveform Container */}
                <div className="flex-1 min-w-0">
                    <div 
                        ref={waveformRef} 
                        className="w-full cursor-pointer"
                        style={{ minHeight: '40px' }}
                    />
                </div>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={isLoading || isDownloading}
                    className={`
                        flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                        transition-all duration-200 transform hover:scale-105
                        ${isLoading || isDownloading
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gray-600 hover:bg-gray-700 shadow-lg hover:shadow-xl'
                        }
                    `}
                    title="Download audio"
                >
                    {isDownloading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Download className="w-4 h-4 text-white" />
                    )}
                </button>

                {/* Time Display */}
                {duration > 0 && (
                    <div className="flex-shrink-0 text-xs text-gray-500 font-mono min-w-0">
                        <span className="text-gray-700">{formatTime(currentTime)}</span>
                        <span className="text-gray-400"> / </span>
                        <span>{formatTime(duration)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}