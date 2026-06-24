export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Video {
  id: string;
  title: string;
  youtube_url: string;
  channel: string;
  description: string;
  thumbnail_url: string;
  status: 'processing' | 'processed' | 'failed';
  created_at: string;
}

export interface Session {
  id: string;
  video_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: string;
  start_time: string;
  end_time: string;   
  text: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  sources?: Source[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ImportVideoResponse {
  id: string;
  title: string;
  status: 'processing' | 'processed';
}
