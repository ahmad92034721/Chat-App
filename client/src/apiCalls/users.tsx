import { axiosInstance } from "./index";
import type { ApiAllUsersResponse, ApiLoginResponse, ApiUserResponse } from "../models/response";
export const getLoggedUser = async () => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<ApiLoginResponse>(
    "/api/user/get-logged-user",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<ApiAllUsersResponse>(
    "/api/user/get-all-users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const uploadUserProfilePic = async (image) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.post<ApiUserResponse>(
    "/api/user/upload-profile-pic",
    { image },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
