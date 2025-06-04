import { SoundCloudTrack } from '@/types/soundcloud';
import { SelectedTrack } from '@/lib/types';
import { getStream } from '@/app/actions';

export async function convertToSelectedTrack(track: SoundCloudTrack): Promise<SelectedTrack> {
  // Get the audio stream URL
  const audioUrl = await getStream(track.id.toString());
  
  // Get the best available artwork URL
  const getArtworkUrl = () => {
    if (track.artwork_url) {
      return track.artwork_url.replace('large', 't300x300');
    }
    return track.user.avatar_url || '/placeholder-track.jpg';
  };

  return {
    trackId: track.id.toString(),
    title: track.title,
    artist: track.user.username,
    imageUrl: getArtworkUrl(),
    duration: Math.floor(track.duration / 1000),
    audioUrl: audioUrl || '',
  };
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 