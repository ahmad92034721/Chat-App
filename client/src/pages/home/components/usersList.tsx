import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store";
import { createNewChat } from "../../../apiCalls/chat";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import type { User } from "../../../models/user";
import type { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import type { Message } from "../../../models/message";

function UsersList({
  searchKey,
  socket,
}: {
  searchKey: string;
  socket: Socket | null;
}) {
  const {
    user: mainUser,
    users,
    chats,
    selectedChat,
  } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
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

  const formatName = (user: User) => {
    const firstName =
      user.firstName.at(0).toUpperCase() +
      user.firstName.slice(1).toLowerCase();
    const lastName =
      user.lastName.at(0).toUpperCase() + user.lastName.slice(1).toLowerCase();
    return firstName + " " + lastName;
  };
  const getLastMessage = (userId) => {
    const chat = chats?.find((chat) =>
      chat.members.map((m) => m._id).includes(userId),
    );
    if (chat && chat.lastMessage) {
      return chat.lastMessage?.sender === mainUser?._id
        ? chat.lastMessage
        : null;
    }
    return "";
  };
  const getLastMessageText = (userId) => {
    const lastMessage = getLastMessage(userId);
    if (lastMessage) {
      return `You: ${lastMessage?.text.substring(0, 25)}`;
    }
    return "";
  };
  const getLastMessageDate = (userId) => {
    const lastMessage = getLastMessage(userId);
    if (lastMessage) {
      const date = new Date(lastMessage.updatedAt || "");
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return time;
    }
    return "";
  };

  const getUnreadMessageCount = (userId) => {
    console.log("Function called for:", userId);
    const chat = chats?.find((chat) => {
      const memberIds = chat.members.map((m) => m._id);
      return memberIds.includes(userId) && memberIds.includes(mainUser?._id);
    });
    if (
      chat &&
      chat.unreadMessageCount &&
      chat.lastMessage?.sender != mainUser?._id
    ) {
      return chat.unreadMessageCount;
    }
    return "";
  };

  const getData = () => {
    if (searchKey == "") {
      return chats;
    } else {
      users?.filter((user) => {
        return (
          (user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchKey.toLowerCase())) &&
          searchKey
        );
      });
    }
  };

  useEffect(() => {
    socket?.on("set-message-count", (message: Message) => {
      if (selectedChat?._id !== message.chatId) {
        const updatedChats = chats?.map((chat) => {
          return chat._id === message.chatId
            ? {
                ...chat,
                unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
                lastMessage: message,
              }
            : chat;
        });
        console.log("Updated chats: ", updatedChats);
        dispatch(setAllChats(updatedChats || chats || []));
      }
      return message;
    });
    return () => {
      socket?.off("set-message-count");
    };
  }, [socket, selectedChat?._id]);
  useEffect(() => {
    socket?.on("online-users", (onlineUsersArray) => {
      setOnlineUsers(onlineUsersArray);
    });
     return () => {
      socket?.off("online-users");
    };
  }, [socket, mainUser?._id, selectedChat?._id, onlineUsers]);

  return (
    <div className="users-list">
      {users &&
        getData()?.map((obj) => {
          let user = obj;
          if (obj.members) {
            user = obj.members.find((m) => m._id != mainUser?._id);
          }
          return (
            <div
              className={
                selectedChat?.members.some((u) => u._id === user._id)
                  ? "user selectedChat"
                  : "user"
              }
              key={user._id}
            >
              <div
                className="user-profile-pict"
                style={
                  onlineUsers.includes(user._id)
                    ? { border: "#82e0aa 3px solid", borderRadius: "50%" }
                    : { border: "" }
                }
              >
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="user-pic"/>
                ) : (
                  <p>
                    {user.firstName.charAt(0).toUpperCase()}{" "}
                    {user.lastName.charAt(0).toUpperCase()}
                  </p>
                )}
              </div>
              <div className="user-details">
                <div className="display-unread-messages">
                  <div className="user-name">{formatName(user)} </div>
                  {getUnreadMessageCount(user._id) && (
                    <div className="unread-messages">
                      {getUnreadMessageCount(user._id)
                        ? `${getUnreadMessageCount(user._id)}`
                        : null}
                    </div>
                  )}
                </div>

                {getLastMessage(user._id) ? (
                  <div>
                    <div className="last-message">
                      <div className="chat-last-message">
                        {getLastMessageText(user._id)}
                      </div>
                      <div className="chat-last-message-time">
                        {getLastMessageDate(user._id)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="user-email">{user.email}</div>
                )}
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
