"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare, LogOut } from "lucide-react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

export function ChatList({ handleChatSelect }) {
  const [chats, setChats] = useState();
  const { logout } = useContext(AuthContext);

  const fetchChats = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/chats`)
      .then((response) => {
        setChats((prevChats) => {
          const updatedChats = response.data;
          const existingChats = prevChats || [];
          const mergedChats = [...existingChats];

          updatedChats.forEach((updatedChat) => {
            const index = mergedChats.findIndex(
              (chat) => chat.id === updatedChat.id
            );
            if (index !== -1) {
              mergedChats[index] = updatedChat;
            } else {
              mergedChats.push(updatedChat);
            }
          });

          return mergedChats;
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chat data:", error);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(fetchChats, 5000);

    // Initial fetch
    fetchChats();

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleNewChat = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
        messages: JSON.stringify([
          { role: "system", content: "New chat created" },
        ]),
      })
      .then((response) => {
        fetchChats();
        handleChatSelect(response.data.id);
      })
      .catch((error) => {
        console.error("Error creating new chat:", error);
      });
  };

  const handleSelectChat = (id) => {
    setChats(
      chats.map((chat) => ({
        ...chat,
        active: chat.id === id,
      }))
    );
    handleChatSelect(id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {chats &&
            chats.map((chat) => (
              <Button
                key={chat.id}
                variant={chat.active ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleSelectChat(chat.id)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            ))}
        </div>
      </ScrollArea>
      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
