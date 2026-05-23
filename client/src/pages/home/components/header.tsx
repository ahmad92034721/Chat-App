import { MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";

function Header({socket}: {socket : Socket}) {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const formatName = (user: User) => {
    const firstName =
      user.firstName.at(0).toUpperCase() +
      user.firstName.slice(1).toLowerCase();
    const lastName =
      user.lastName.at(0).toUpperCase() + user.lastName.slice(1).toLowerCase();
    return firstName + " " + lastName;
  };
  const fullName = user ? formatName(user) : "Guest";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "GU";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(showLoader());
    localStorage.removeItem("token");
    socket.emit('user-logged-out',  user?._id)
    setTimeout(() => {
      dispatch(hideLoader());
      navigate("/login");
    }, 2000);
  };
  return (
    <div className="app-header">
      <div className="app-logo">
        <MessageCircle className="icon" />
        Chat App
      </div>
      <div className="header-right-section">
        <div
          className="app-user-profile"
          onClick={() => {
            navigate("/profile");
          }}
        >
          {user?.profilePicture ? (
            <img
              src={user?.profilePicture}
              alt="profile pic"
              className="logged-user-pic"
            ></img>
          ) : (
            <div className="logged-user-pic">{initials}</div>
          )}
          <div className="logged-user-name">{fullName}</div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <i className="fa fa-power-off"></i>
        </button>
      </div>
    </div>
  );
}
export default Header;
