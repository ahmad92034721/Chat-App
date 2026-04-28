import {axiosInstance} from './index'
import type { ApiAllUsersResponse, ApiLoginResponse } from '../models/response';
export const getLoggedUser = async () => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.get<ApiLoginResponse>('/api/user/get-logged-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
}
export const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.get<ApiAllUsersResponse>('/api/user/get-all-users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
}

// router.get('/get-all-users', authMiddleware, async (req, res) => {
//   try{
//     const users = await User.find({_id: {$ne: req.userId}});
//     res.send({message: 'users fetched successfully', success: true, data: users});
//   }
//   catch(error)
//   {
//     res.status(400).send({message: error.message, success: true, data: null})
//   }
// })
