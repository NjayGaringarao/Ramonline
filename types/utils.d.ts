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
  deviceModel: string;
  osName: string;
  countryName: string;
  ip: string;
}

export interface RefreshUserRecordType {
  info?: boolean;
  activity?: boolean;
  line?: boolean;
  post?: boolean;
  notification?: boolean;
}
