import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store";
import { createNewChat } from "../../../apiCalls/chat";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";

function UsersList({ searchKey }: { searchKey: string }) {
  const {
    user: mainUser,
    users,
    chats,
    selectedChat,
  } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const startNewChat = async (userId: string) => {
    try {
      dispatch(showLoader());
      const response = await createNewChat([mainUser?._id || "", userId]);
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChat = [...(chats || []), newChat];
        dispatch(setAllChats(updatedChat));
      }
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const displaySelectedChat = (userId) => {
    const openedChat = chats?.find((chat) => {
      return (
        chat.members.map((u) => u._id).includes(userId) &&
        chat.members.map((u) => u._id).includes(mainUser?._id)
      );
    });
    if (openedChat) {
      dispatch(setSelectedChat(openedChat));
    }
  };
  return (
    <div className="users-list">
      {users &&
        users
          .filter((user) => {
            return (
              ((user.firstName
                .toLowerCase()
                .includes(searchKey.toLowerCase()) ||
                user.lastName
                  .toLowerCase()
                  .includes(searchKey.toLowerCase())) &&
                searchKey) ||
              chats?.some((chat) =>
                chat.members.map((u) => u._id).includes(user._id),
              )
            );
          })
          .map((user) => {
            return (
              <div
                className={
                  selectedChat?.members.some((u) => u._id === user._id)
                    ? "user selectedChat"
                    : "user"
                }
                key={user._id}
              >
                <div className="user-profile-pict">
                  {user.profilePicture ? (
                    <img src="" alt="" />
                  ) : (
                    <p>
                      {user.firstName.charAt(0).toUpperCase()}{" "}
                      {user.lastName.charAt(0).toUpperCase()}
                    </p>
                  )}
                </div>
                <div className="user-details">
                  <div className="user-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="user-email">{user.email}</div>
                </div>
                {chats?.find((chat) =>
                  chat.members.map((u) => u._id).includes(user._id),
                ) ? (
                  <div
                    className="view-chat"
                    onClick={() => {
                      displaySelectedChat(user._id);
                    }}
                  >
                    <button
                      className="view-chat-btn"
                      onClick={() => {
                        displaySelectedChat(user._id);
                      }}
                    >
                      View Chat
                    </button>
                  </div>
                ) : (
                  <div className="start-chat">
                    <button
                      className="start-chat-btn"
                      onClick={() => startNewChat(user._id)}
                    >
                      Start Chat
                    </button>
                  </div>
                )}
              </div>
            );
          })}
    </div>
  );
}
export default UsersList;
