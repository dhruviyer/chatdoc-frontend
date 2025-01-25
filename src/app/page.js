"use client";

import ProtectedRoute from "./components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import { ChatList } from "./components/ChatList";
import { ChatInterface } from "./components/ChatInterface";
import { Separator } from "../components/ui/separator";
import { TicketSidebar } from "./components/TicketSidebar";

export default function Home() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [ticketid, setTicketId] = useState(null);

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex h-screen">
          <div className="w-64 border-r">
            <ChatList handleChatSelect={handleChatSelect} />
          </div>
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <ChatInterface
                setTicketId={setTicketId}
                selectedChatId={selectedChatId}
              />
            </div>
            <Separator orientation="vertical" />
            <div className="w-80">
              <TicketSidebar ticketid={ticketid} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
