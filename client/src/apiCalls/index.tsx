import axios from "axios";

export const url = "http://localhost:3000";

export const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
