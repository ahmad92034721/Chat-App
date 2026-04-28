import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../models/user";
import type { Chat } from "../models/user";

interface UserState {
  user: User | null;
  users: User[] | [] | null
  chats: Chat[] | [] | null
  selectedChat: Chat | null
}

const initialState: UserState = {
  user: null,
  users: [],
  chats: [],
  selectedChat: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setAllUsers: (state, action: PayloadAction<User[] | []>) => {
      state.users = action.payload
    },
    setAllChats: (state, action: PayloadAction<Chat[] | []>) => {
      state.chats = action.payload
    },
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload
    }
  },
});

export const { setUser, setAllUsers, setAllChats, setSelectedChat } = userSlice.actions;
export default userSlice.reducer;
