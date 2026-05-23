import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { uploadUserProfilePic } from "../../apiCalls/users";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { setUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
function Profile() {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [profilePic, setProfilePic] = useState("");
  const dispatch = useDispatch();
  const formatName = (user) => {
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
  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const fileUrl = reader.result;
      setProfilePic(fileUrl);
      console.log(fileUrl);
    };
  };
  const uploadProfilePic = async () => {
    try {
      dispatch(showLoader());
      const response = await uploadUserProfilePic(profilePic);
      if (response.success) {
        toast.success(response.message);
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePic(user.profilePicture);
    }
  }, [user]);
  return (
    <div className="page profile-page">
      <div className="profile-page-container">
        <div className="profile-pic-container">
          {profilePic ? (
            <img src={profilePic} alt="" className="user-profile-pic" />
          ) : (
            <div className="user-default-profile-pic">{initials}</div>
          )}
        </div>
        <div className="profile-info-container">
          <div className="user-name">
            <h1>{fullName}</h1>
          </div>
          <div className="user-email">
            <b>Email: </b>
            <span>{user?.email}</span>
          </div>
          <div className="account-creation-date">
            <b>Account Created: </b> <span>{user?.createdAt.split("T")[0]}</span>
          </div>
          <div className="select-profile-pic">
            <input type="file" onChange={handleFileSelected} />
          </div>
          <button className="image-save-btn" onClick={uploadProfilePic}>Save</button>
        </div>
      </div>
    </div>
  );
}
export default Profile;
