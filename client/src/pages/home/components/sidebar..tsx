import { useState } from "react";
import Searchbar from "./searchbar";
import UsersList from "./usersList";
import type { Socket } from "socket.io-client";

function Sidebar({socket } : {socket: Socket | null}) {
  const [searchKey, setSearchKey] = useState('');
  return <div className="app-sidebar">
      <h2>Chats</h2>
    <Searchbar searchKey={searchKey} setSearchKey={setSearchKey}></Searchbar>
    <UsersList searchKey={searchKey} socket={socket}></UsersList>
  </div>;
}

export default Sidebar;
