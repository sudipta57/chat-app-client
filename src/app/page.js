"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState([]);
  const [showMessageme, setShowMessageme] = useState([]);

  // useEffect to establish socket connection when component mounts
  useEffect(() => {
    const socket = io("https://simple-chat-app-server-sigma.vercel.app");
    setSocket(socket);
  }, []);

  // Event listener to handle incoming messages
  useEffect(() => {
    if (socket) {
      socket.on("recieved-message", (message) => {
        setShowMessage([...showMessage, message]);
      });
      socket.on("recieved-message-me", (message) => {
        setShowMessageme([...showMessageme, message]);
      });
    }
  }, [socket, showMessage]);

  // Function to send message via socket
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      window.alert("Please enter a message");
      return;
    }
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <>
      <center>
        <h1 className="text-3xl">Chat app</h1>
        <h1 className="mt-4">{socket && `Your ID: ${socket.id}`}</h1>

        <div className="w-[350px] h-[75vh] border-pink-400 border-2 my-6 rounded-xl relative">
          <div className="flex justify-between">
            <div className="bg-white w-[50%] h-[75vh]  rounded-lg text-black overflow-y-auto relative">
              <h1>opponent user</h1>
              <div className="px-10">
                {showMessage.map((msg, index) => (
                  <p key={index} className="text-white bg-black my-4">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-pink-300 w-[50%] h-[75vh] rounded-lg relative overflow-y-auto">
              <h1>Me</h1>
              <div className="px-10">
                {showMessageme.map((msg, index) => (
                  <p key={index} className="text-black bg-white my-4">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={sendMessage}
          className="sticky bottom-0 left-0 right-0 "
        >
          <div className="space-x-12 py-4">
            <input
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-black border-4 rounded-lg w-36"
            />
          </div>
        </form>
      </center>
    </>
  );
}
