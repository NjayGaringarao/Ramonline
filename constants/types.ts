export interface PostType {
  id: string;
  caption?: string;
  image_ids?: string[];
  audio_id?: string;
  created_at?: string;
  user: UserType;
}

export interface UserType {
  id: string;
  email?: string;
  username: string;
  name?: string[];
  avatar_url?: string;
  picture_id?: string;
  role: string[4];
  joined_at?: string;
}
export interface ExtendedUserType extends UserType {
  posts: PostType[];
  subscriptions: LineType[];
  lines: LineType[];
  viewed_notification_ids: string[];
}

export interface TargetType {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  identifier: string;
}

export interface LineType {
  id: string;
  created_at: string;
  name: string;
  description: string;
  user_id: string;
  banner_id: string;
}

export interface ExtendedLineType extends LineType {
  subscribers: UserType[];
  notifications: NotificationType[];
}

export interface NotificationType {
  id: string;
  created_at: string;
  title: string;
  description: string;
  post_id: string;
  line_id: string;
}

// Essentials
export interface AffiliationType {
  first: string | null;
  second: string | null;
  third: string | null;
  year: string | null;
}

export interface SessionType {
  id: string;
  current: boolean;
  deviceModel: string;
  osName: string;
  countryName: string;
  ip: string;
}
