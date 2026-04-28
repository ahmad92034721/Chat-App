export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}
export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string
}
export interface LoginUserPayload {
  email: string;
  password: string
}
export interface Chat {
  _id: string
  members: User[],
  lastMessage?: string,
  unreadMessageCount?: number
}