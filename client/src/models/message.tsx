export interface Message {
  _id?: string,
  chatId: string,
  sender: string,
  text: string,
  read?: boolean,
  updatedAt?: string;
}