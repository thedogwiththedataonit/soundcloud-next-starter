export interface SoundCloudToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  scope: string;
}

export interface SoundCloudUser {
  id: number;
  urn: string;
  kind: string;
  permalink_url: string;
  uri: string;
  username: string;
  permalink: string;
  created_at: string;
  last_modified: string;
  first_name: string;
  last_name: string;
  full_name: string;
  city: string;
  description: string;
  country: string;
  avatar_url: string;
  track_count: number;
  public_favorites_count: number;
  reposts_count: number;
  followers_count: number;
  followings_count: number;
  plan: string;
  myspace_name: string | null;
  discogs_name: string | null;
  website_title: string | null;
  website: string | null;
  comments_count: number;
  online: boolean;
  likes_count: number;
  playlist_count: number;
  subscriptions?: any[];
}

export interface SoundCloudTrack {
  kind: string;
  id: number;
  urn: string;
  created_at: string;
  duration: number;
  commentable: boolean;
  comment_count: number;
  sharing: string;
  tag_list: string;
  streamable: boolean;
  embeddable_by: string;
  purchase_url: string | null;
  purchase_title: string | null;
  genre: string;
  title: string;
  description: string;
  label_name: string;
  release: string | null;
  key_signature: string | null;
  isrc: string | null;
  bpm: number | null;
  release_year: number | null;
  release_month: number | null;
  release_day: number | null;
  license: string;
  uri: string;
  user: SoundCloudUser;
  permalink_url: string;
  artwork_url: string | null;
  stream_url: string | null;
  download_url: string | null;
  waveform_url: string;
  available_country_codes: string[] | null;
  secret_uri: string | null;
  user_favorite: boolean | null;
  user_playback_count: number | null;
  playback_count: number;
  download_count: number;
  favoritings_count: number;
  reposts_count: number;
  downloadable: boolean;
  access: string;
  policy: string | null;
  monetization_model: string | null;
  metadata_artist?: string;
}

export interface SoundCloudSearchResponse {
  collection: SoundCloudTrack[];
  next_href?: string;
} 