import { axiosInstance } from "./index"
import type { Message } from "../models/message"
import type { ApiAllMessagesResponse } from "../models/response"

export const  createNewMessage = async (message: Message) =>
{
    const token = localStorage.getItem('token')
    const response = await axiosInstance.post('/api/message/new-message', message,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  
}
export const  getAllChatMessages = async (chatId: string | null) =>
{
    const token = localStorage.getItem('token')
    const response = await axiosInstance.get<ApiAllMessagesResponse>(`/api/message/get-all-messages/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  
}