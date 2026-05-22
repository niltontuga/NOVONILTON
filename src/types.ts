/**
 * Shared Type Definitions for Nilton Nascimento Playlists App
 */

export interface Video {
  id: string; // YouTube Video ID
  title: string;
  duration: string;
  publishedAt: string; // ISO string or simple date 'YYYY-MM-DD'
  dateOffsetDays: number; // Days offset from May 22, 2026
  description: string;
  type: 'podcast' | 'micro';
}

export interface UserProgress {
  subscribed: boolean;
  notified: boolean;
  favoritedPlaylists: ('podcast' | 'micro')[];
  watchedVideos: string[]; // List of video IDs
}
