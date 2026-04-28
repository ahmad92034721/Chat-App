import type { User } from "./user";
import type {Chat} from "./user"
import type { Message } from "./message";
export interface ApiLoginResponse {
  message: string;
  success: boolean;
  data: User | null;
}
export interface ApiAllUsersResponse {
  message: string;
  success: boolean;
  data: User[] | [];
}
export interface ApiAllChatsResponse {
  message: string;
  success: boolean;
  data: Chat[] | [];
}
export interface ApiNewMessageResponse {
  message: string;
  success: boolean;
  data?: Message
}
export interface ApiAllMessagesResponse {
  message: string;
  success: boolean;
  data?: Message[] | [] | null
}
