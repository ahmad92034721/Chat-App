import { axiosInstance } from "./index"
import type { ApiAllChatsResponse } from "../models/response"
export const  getAllUserChats = async () =>
{
    const token = localStorage.getItem('token')
    const response = await axiosInstance.get<ApiAllChatsResponse>('/api/chat/get-all-chats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  
}

export const createNewChat = async (members: string[]) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post('/api/chat/create-new-chat', {members},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
