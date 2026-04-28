import Header from "./components/header";
import Sidebar from "./components/sidebar.";
import Chat from "./components/chat";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

function Home() {
  const {selectedChat} = useSelector((state: RootState) => state.userReducer);
  return (
    <div className="home-page">
      <Header></Header>
      <div className="home-page-main-content">
        <Sidebar></Sidebar>
        {selectedChat && <Chat></Chat>}
      </div>
    </div>
  );
}
export default Home;
