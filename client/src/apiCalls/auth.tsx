import { axiosInstance, url } from "./index.tsx";
import type {RegisterUserPayload, LoginUserPayload}  from "../models/user.tsx";


export const signupUser = async (user: RegisterUserPayload)=>{
  const response = await axiosInstance.post(url + '/api/auth/signup', user);
  return response.data;
}

export const loginUser = async (user: LoginUserPayload) => {
  const response = await axiosInstance.post(url + '/api/auth/login', user);
  return response.data;
}
