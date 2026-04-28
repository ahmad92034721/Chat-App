import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getLoggedUser } from "../apiCalls/users";
import { getAllUserChats } from "../apiCalls/chat";
import type { ApiAllChatsResponse, ApiAllUsersResponse, ApiLoginResponse } from "../models/response";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import {useDispatch} from 'react-redux';
import { showLoader, hideLoader } from "../redux/loaderSlice";
import {setUser, setAllUsers, setAllChats} from '../redux/userSlice'


function ProtectedRoute({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 useEffect(() => {
  const checkUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      dispatch(showLoader());
      const response: ApiLoginResponse = await getLoggedUser();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      navigate("/login", { replace: true });
    }
  };
  const checkAllUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      dispatch(showLoader());
      const response: ApiAllUsersResponse = await getAllUsers();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllUsers(response.data));
      } else {
        toast.error(response.message);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      navigate("/login", { replace: true });
    }
  };
  const checkCurrentUserChats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {replace: true});
      return
    }
    try {
      dispatch(showLoader());
      const response: ApiAllChatsResponse = await getAllUserChats();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllChats(response.data));
      } else {
        toast.error(response.message);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      navigate("/login", { replace: true });
    }
  };

  checkUser();
  checkAllUsers();
  checkCurrentUserChats();
}, [navigate]);

  return (
      <div>{children}</div>
  );
}

export default ProtectedRoute;
