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

export interface UserPostListType {
  total: number;
  post_info: PostType.Info[];
}

export interface UserLineListType {
  total: number;
  line_info: LineType.Info[];
}

export interface UserRecordType {
  info: UserType.Info;
  activity: UserType.Activity;
  line: UserLineListType;
  post: UserPostListType;
}
