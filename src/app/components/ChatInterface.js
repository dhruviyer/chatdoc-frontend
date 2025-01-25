"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot } from "lucide-react";
import axios from "axios";

export function ChatInterface({ setTicketId, selectedChatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Simulating loading messages for the selected chat
    if (!selectedChatId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/chats/${selectedChatId}`)
      .then((response) => {
        setMessages(JSON.parse(response.data.messages));
        if (response.data.ticket) {
          setTicketId(response.data.ticket.id);
        } else {
          setTicketId(null);
        }
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chat data:", error);
      });
  }, [selectedChatId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${selectedChatId}`, {
          messages: JSON.stringify([
            ...messages,
            { role: "user", content: input },
          ]),
        })
        .then((response) => {
          setMessages(JSON.parse(response.data.messages));
          console.log(response.data);
        });
      setInput("");
      // Scroll to the bottom
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start`}
              >
                <Avatar className="w-8 h-8">
                  {message.role === "user" ? (
                    <User className="w-6 h-6" />
                  ) : (
                    <Bot className="w-6 h-6" />
                  )}
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={`max-w-[80%] mx-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </Card>
  );
}
