import { axiosInstance, url } from "./index"
import type { ApiAllChatsResponse } from "../models/response"
export const  getAllUserChats = async () =>
{
    const token = localStorage.getItem('token')
    const response = await axiosInstance.get<ApiAllChatsResponse>(url + '/api/chat/get-all-chats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  
}

export const createNewChat = async (members: string[]) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post(url + '/api/chat/create-new-chat', {members},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }

export const clearUnreadMessages = async (chatId: string) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post(url + '/api/chat/clear-unread-message', {chatId},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
