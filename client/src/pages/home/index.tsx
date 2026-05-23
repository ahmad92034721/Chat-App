import Header from "./components/header";
import Sidebar from "./components/sidebar.";
import Chat from "./components/chat";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";


function Home() {
  const { selectedChat, user } = useSelector(
    (state: RootState) => state.userReducer,
  );
   const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    socketRef.current = io("https://chat-app-server-f9vr.onrender.com");

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  useEffect(() => {
    if (user) {
      socketRef.current?.emit("join-room", user?._id);
      socketRef.current?.emit("user-logged-in", user?._id);
    }
  }, [user?._id]);
  return (
    <div className="home-page">
      <Header socket={socketRef.current}></Header>
      <div className="home-page-main-content">
        <Sidebar socket={socketRef.current}></Sidebar>
        {selectedChat && <Chat socket={socketRef.current}></Chat>}
      </div>
    </div>
  );
}
export default Home;
