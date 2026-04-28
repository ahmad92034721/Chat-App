import { MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

function Header() {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const fullName = user ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}` : "Guest";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "GU";

  return (
    <div className="app-header">
      <div className="app-logo">
        <MessageCircle className="icon" />
        Chat App
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{fullName}</div>
        <div className="logged-user-pic">{initials}</div>
      </div>
    </div>
  );
}
export default Header;
