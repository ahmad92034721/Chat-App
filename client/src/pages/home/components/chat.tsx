import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  createNewMessage,
  getAllChatMessages,
} from "../../../apiCalls/message";
import type { ApiNewMessageResponse } from "../../../models/response";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import type { Message } from "../../../models/message";

function Chat() {
  const { selectedChat, user } = useSelector(
    (state: RootState) => state.userReducer,
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[] | [] | null>([]);
  const [selectedMessagesId, setSelectedMessagesId] = useState<string[]>(
    []
  );
  const dispatch = useDispatch();
  const selectedUser = selectedChat?.members.find((u) => u._id != user?._id);
  const getChatMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllChatMessages(selectedChat?._id || null);
      setMessages(response.data || []);
      console.log(response.data);
      dispatch(hideLoader());
    } catch (error) {
      hideLoader();
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const sendMessage = async () => {
    try {
      const response: ApiNewMessageResponse = await createNewMessage({
        chatId: selectedChat?._id || "",
        sender: user?._id || "",
        text: message,
      });
      if (response.success) {
        setMessage("");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Message not sent");
      }
    }
  };

  const toggleMessageShowTime = (id: string) => {
    setSelectedMessagesId((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }
  const timeFormatter = (date: string) => {
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
    const formattedDay = today === Number(day) ? "today" : today - 1 === Number(day) ? "yesterday" : day
    return (formattedDay === "today" || formattedDay === "yesterday") ? `${formattedDay} ${time}` : `${formattedDay} ${month} ${time}`;
  };

  useEffect(() => {
    if (selectedChat?._id) {
      getChatMessages();
    }
  }, [selectedChat?._id]);
  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            <h2>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </h2>
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
                {selectedMessagesId.includes(msg._id) && (
                  <span className={
                    msg.sender === user?._id
                      ? "message-time-sent"
                      : "message-time-received"
                  }>{timeFormatter(msg.createdAt)}</span>
                )}
              </>
            ))}
          </div>
          <div>
            <textarea
              name=""
              id=""
              placeholder="Type a message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              className="fa fa-paper-plane send-message-btn"
              onClick={sendMessage}
              aria-hidden="true"
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
