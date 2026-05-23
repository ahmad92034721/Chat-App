export interface Message {
  _id?: string,
  chatId: string,
  sender: string,
  text?: string,
  image? : string,
  read?: boolean,
  createdAt?: string;
}