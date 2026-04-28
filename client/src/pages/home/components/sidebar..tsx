import { useState } from "react";
import Searchbar from "./searchbar";
import UsersList from "./usersList";

function Sidebar() {
  const [searchKey, setSearchKey] = useState('');
  return <div className="app-sidebar">
      <h2>Chats</h2>
    <Searchbar searchKey={searchKey} setSearchKey={setSearchKey}></Searchbar>
    <UsersList searchKey={searchKey}></UsersList>
  </div>;
}

export default Sidebar;
