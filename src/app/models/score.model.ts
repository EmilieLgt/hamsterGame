export interface IScore {
  id?: string;
  created_at?: number;
  months: number;
  hamsters: number;
  user_name: string;
}

export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
