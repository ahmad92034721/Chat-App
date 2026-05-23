import axios from "axios";

export const url = "https://chat-app-server-f9vr.onrender.com";

export const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
