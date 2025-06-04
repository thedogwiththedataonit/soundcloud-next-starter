import { Redis } from '@upstash/redis';
import { SoundCloudToken, SoundCloudTrack, SoundCloudSearchResponse } from '@/types/soundcloud';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID!;
const SOUNDCLOUD_CLIENT_SECRET = process.env.SOUNDCLOUD_CLIENT_SECRET!;
const TOKEN_KEY = 'soundcloud_token';

// Debug logging
console.log('Environment check:', {
  hasClientId: !!SOUNDCLOUD_CLIENT_ID,
  hasClientSecret: !!SOUNDCLOUD_CLIENT_SECRET,
  clientIdLength: SOUNDCLOUD_CLIENT_ID?.length || 0,
  clientSecretLength: SOUNDCLOUD_CLIENT_SECRET?.length || 0,
});

export async function getAccessToken(): Promise<string> {
  try {
    // Try to get existing token from Redis
    const storedToken = await redis.get<SoundCloudToken>(TOKEN_KEY);
    
    if (storedToken && storedToken.expires_at > Date.now()) {
      return storedToken.access_token;
    }

    // If we have a refresh token and it's expired, try to refresh
    if (storedToken?.refresh_token) {
      try {
        const refreshedToken = await refreshToken(storedToken.refresh_token);
        return refreshedToken.access_token;
      } catch (error) {
        console.log('Failed to refresh token, getting new one:', error);
      }
    }

    // Get new token using client credentials
    const newToken = await getNewToken();
    return newToken.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get SoundCloud access token');
  }
}

async function getNewToken(): Promise<SoundCloudToken> {
  const credentials = Buffer.from(`${SOUNDCLOUD_CLIENT_ID}:${SOUNDCLOUD_CLIENT_SECRET}`).toString('base64');
  console.log('Debug info:', {
    clientId: SOUNDCLOUD_CLIENT_ID,
    clientSecret: SOUNDCLOUD_CLIENT_SECRET ? '[REDACTED]' : 'MISSING',
    credentials: credentials,
  });
  
  const response = await fetch('https://secure.soundcloud.com/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  console.log('SoundCloud API response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.log('Error response body:', errorBody);
    throw new Error(`Failed to get token: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const tokenData = await response.json();
  const token: SoundCloudToken = {
    ...tokenData,
    expires_at: Date.now() + (tokenData.expires_in * 1000) - 60000, // Subtract 1 minute for safety
  };

  // Store token in Redis
  await redis.set(TOKEN_KEY, token, { ex: tokenData.expires_in - 60 }); // Expire 1 minute early
  
  return token;
}

async function refreshToken(refreshTokenValue: string): Promise<SoundCloudToken> {
  const response = await fetch('https://secure.soundcloud.com/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: SOUNDCLOUD_CLIENT_ID,
      client_secret: SOUNDCLOUD_CLIENT_SECRET,
      refresh_token: refreshTokenValue,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
  }

  const tokenData = await response.json();
  const token: SoundCloudToken = {
    ...tokenData,
    expires_at: Date.now() + (tokenData.expires_in * 1000) - 60000,
  };

  // Store refreshed token in Redis
  await redis.set(TOKEN_KEY, token, { ex: tokenData.expires_in - 60 });
  
  return token;
}

export async function searchTracks(
  query: string, 
  limit: number = 25, 
  offset: number = 0
): Promise<{ tracks: SoundCloudTrack[]; nextHref?: string; total?: number }> {
  const accessToken = await getAccessToken();
  console.log('accessToken', accessToken);
  
  const searchParams = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    offset: offset.toString(),
    access: 'playable',
    linked_partitioning: 'true',
  });

  const response = await fetch(`https://api.soundcloud.com/tracks?${searchParams}`, {
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Authorization': `OAuth ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`SoundCloud API error: ${response.status} ${response.statusText}`);
  }

  const data: SoundCloudSearchResponse = await response.json();
  
  return {
    tracks: data.collection || [],
    nextHref: data.next_href,
  };
} 
