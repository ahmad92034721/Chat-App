import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  createNewMessage,
  getAllChatMessages,
} from "../../../apiCalls/message";
import { getAllUserChats, clearUnreadMessages } from "../../../apiCalls/chat";
import type { ApiNewMessageResponse } from "../../../models/response";
import toast from "react-hot-toast";
import { setAllChats } from "../../../redux/userSlice";
import { useEffect, useState, useRef } from "react";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import type { Message } from "../../../models/message";
import type { User } from "../../../models/user";
import type { Socket } from "socket.io-client";
import EmojiPicker, { Theme } from "emoji-picker-react";

function Chat({ socket }: { socket: Socket }) {
  const { selectedChat, user, chats } = useSelector(
    (state: RootState) => state.userReducer,
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[] | [] | null>([]);
  const [selectedMessagesId, setSelectedMessagesId] = useState<string[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const selectedUser = selectedChat?.members.find((u) => u._id != user?._id);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getChatMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllChatMessages(selectedChat?._id || null);
      setMessages(response.data || []);
      dispatch(hideLoader());
    } catch (error) {
      hideLoader();
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const clearChatUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chatId: selectedChat?._id,
        members: selectedChat?.members.map((m) => m._id),
      });
      const response = await clearUnreadMessages(selectedChat?._id || "");
      if (response.success) {
        chats?.map((chat) => {
          if (chat._id === selectedChat?._id) return response.data;
          return chat;
        });
      }
    } catch (error) {
      hideLoader();
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const sendMessage = async (image) => {
    try {
      const newMessage = {
        chatId: selectedChat?._id || "",
        sender: user?._id || "",
        text: message,
        image: image,
      };
      const response: ApiNewMessageResponse =
        await createNewMessage(newMessage);

      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat?.members.map((u) => u._id),
        read: false,
        createdAt: new Date().toISOString(),
      });
      if (response.success) {
        setMessage("");
        setShowEmoji(false);
        const chatsResponse = await getAllUserChats();
        if (chatsResponse.success) {
          dispatch(setAllChats(chatsResponse.data));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Message not sent");
      }
    }
  };
  const formatName = (user: User) => {
    const firstName = user.firstName
      ? `${user.firstName.charAt(0).toUpperCase()}${user.firstName
          .slice(1)
          .toLowerCase()}`
      : "";
    const lastName = user.lastName
      ? `${user.lastName.charAt(0).toUpperCase()}${user.lastName
          .slice(1)
          .toLowerCase()}`
      : "";
    return firstName + " " + lastName;
  };
  const toggleMessageShowTime = (id: string) => {
    setSelectedMessagesId((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const timeFormatter = (date: string) => {
    console.log("timeformatter is called");
    const dateObj = new Date(date);
    const day = dateObj.toLocaleString("en-US", { day: "2-digit" });
    // const weekday = dateObj.toLocaleString("en-US", { weekday: "short" });
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    // const year = dateObj.toLocaleString("en-US", { year: "numeric" });
    const time = dateObj.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const today = new Date().getDate();
    const formattedDay =
      today === Number(day)
        ? "today"
        : today - 1 === Number(day)
          ? "yesterday"
          : day;

    return formattedDay === "today" || formattedDay === "yesterday"
      ? `${formattedDay} ${time}`
      : `${formattedDay} ${month} ${time}`;
  };
  const sendImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      sendMessage(reader.result);
    };
  };

  useEffect(() => {
    if (selectedChat?._id) {
      getChatMessages();

      if (selectedChat.lastMessage?.sender !== user?._id) {
        clearChatUnreadMessages();
      }
    }

    const handleReceiveMessage = (message: Message) => {
      if (selectedChat?._id === message.chatId) {
        setIsTyping(false);
        setMessages((prev) => [...prev, message]);
      }

      if (
        selectedChat?._id === message.chatId &&
        message.sender !== user?._id
      ) {
        clearChatUnreadMessages();
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, selectedChat?._id, user?._id]);

  useEffect(() => {
    if (messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    socket.on("message-count-cleared", (data) => {
      console.log("message-count-cleared");

      if (selectedChat?._id == data.chatId) {
        console.log("message-count-cleared");

        const updatedChats =
          chats?.map((chat) =>
            chat._id === selectedChat?._id
              ? { ...chat, unreadMessageCount: 0 }
              : chat,
          ) || [];
        dispatch(setAllChats(updatedChats));
        setMessages((prev) =>
          prev ? prev?.map((m) => ({ ...m, read: true })) : prev,
        );
      }
    });
    return () => {
      socket.off("message-count-cleared");
    };
  }, [socket]);
  useEffect(() => {
    socket.on("started-typing", (data) => {
      setData(data);
      if (data.chatId === selectedChat?._id && data.sender !== user?._id) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 4000);
      }
    });
    return () => {
      socket.off("started-typing");
    };
  }, [socket, user?._id]);
  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            <h2>{formatName(selectedUser)}</h2>
          </div>
          <div className="app-chat-area-messages">
            {messages?.map((msg) => (
              <>
                <div
                  key={msg._id}
                  onClick={() => toggleMessageShowTime(msg._id)}
                  className={
                    msg.sender === user?._id
                      ? "message-sent"
                      : "message-received"
                  }
                >
                  {msg.text}
                </div>
                {msg.image && (
                  <img
                    src={msg.image}
                    height="250px"
                    width="125px"
                    className={
                      msg.sender === user?._id ? "image-sent" : "image-received"
                    }
                  ></img>
                )}
                {selectedMessagesId.includes(msg._id) && (
                  <span
                    className={
                      msg.sender === user?._id
                        ? "message-time-sent"
                        : "message-time-received"
                    }
                  >
                    {timeFormatter(msg.createdAt)}{" "}
                    {msg.sender === user?._id && msg.read && (
                      <i
                        className="fa fa-check-circle"
                        aria-hidden="true"
                        style={{ color: "#0ea5ff" }}
                      ></i>
                    )}
                  </span>
                )}
              </>
            ))}
            <div ref={messagesEndRef} />
            {isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && (
              <div className="typing-indicator">
                <i className="dots">Typing</i>
              </div>
            )}
          </div>
          {showEmoji && (
            <div className="emoji-container">
              <EmojiPicker
                style={{width:'300px', height:"400px"}}
                theme={Theme.DARK}
                onEmojiClick={(emojiObject) =>
                  setMessage((prev) => prev + emojiObject.emoji)
                }
              />
            </div>
          )}
          <div>
            <textarea
              name=""
              id=""
              placeholder="Type a message"
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit("user-typing", {
                  chatId: selectedChat._id,
                  members: selectedChat.members.map((m) => m._id),
                  sender: user?._id,
                });
              }}
              value={message}
            />
            <label htmlFor="file">
              <i className="far fa-images send-image-btn"></i>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => sendImage(e)}
                accept="image/jpg,image/png,image/jpeg,image/gif"
              />
            </label>
            <button
              className="fa fa-face-smile send-emoji-btn"
              onClick={() => setShowEmoji(!showEmoji)}
              aria-hidden="true"
            ></button>
            <button
              className="fa fa-paper-plane send-message-btn"
              onClick={() => sendMessage("")}
              aria-hidden="true"
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
