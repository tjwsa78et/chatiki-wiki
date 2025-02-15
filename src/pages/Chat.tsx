
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, LogOut } from "lucide-react";
import { toast } from "sonner";
import {useAuth} from "@/layouts/authContext.ts";

interface Message {
  type: "user" | "bot";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const credentials = localStorage.getItem("userCredentials");
      if (!credentials) throw new Error("No credentials found");

      const response = await fetch("https://tjwsa78et.app.n8n.cloud/webhook/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`,
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        console.log(response.status);
        if (response.status === 401 || response.status === 403) {
          toast.error("Invalid credentials. Please log in again with correct username and password.");
          localStorage.removeItem("userCredentials");
          auth.resetAuthentication();
          return;
        }
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { type: "bot", content: data.output }]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userCredentials");
    navigate("/");
    toast.success("Successfully logged out");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Chat Interface</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        <Card className="flex-1 p-4 backdrop-blur-sm bg-white/90 shadow-xl border border-gray-100 mb-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left"
              >
                <div className="inline-block p-3 rounded-lg bg-gray-100">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
