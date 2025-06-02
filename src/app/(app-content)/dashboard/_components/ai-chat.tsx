"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Message = {
  role: "user" | "ai";
  content: string;
};

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: prompt.trim() },
    ];
    setMessages(newMessages);
    setLoading(true);
    setPrompt("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });

      const jsonData = await res.json();
      const aiMessage = jsonData.text || "No response";
      setMessages([...newMessages, { role: "ai", content: aiMessage }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "ai", content: "Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 h-[300px] overflow-y-auto border rounded-md p-3 bg-zinc-50">
          {messages.length === 0 && !loading ? (
            <p className="text-center text-gray-400 mt-4">
              Start a conversation
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg whitespace-pre-wrap max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                {msg.content}
              </div>
            ))
          )}
          {loading && (
            <div className="italic text-sm text-gray-500 animate-pulse">
              AI is typing...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something..."
            className="resize-none"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? "Generating..." : "Send"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
