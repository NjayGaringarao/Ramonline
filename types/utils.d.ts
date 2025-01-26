import { PostType, LineType, UserType } from "./models";

export interface AffiliationType {
  first: string | null;
  second: string | null;
  third: string | null;
  year: string | null;
}

export interface SessionType {
  id: string;
  current: boolean;
  created_at: Date;
  osName: string;
  country: string;
  ip: string;
}

export interface RefreshUserRecordType {
  info?: boolean;
  line?: boolean;
  post?: boolean;
  notification?: boolean;
}
