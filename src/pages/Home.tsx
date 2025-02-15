
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Settings } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 space-y-3"
      >
        <h1 className="text-4xl font-bold tracking-tight">ChatWiki</h1>
        <p className="text-gray-500">Your intelligent knowledge companion</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card
          className="p-6 backdrop-blur-sm bg-white/90 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
          onClick={() => navigate("/chat")}
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Chat Interface</h2>
            <p className="text-sm text-gray-500">
              Ask questions and get answers from our knowledge base
            </p>
            <Button className="w-full">Start Chatting</Button>
          </div>
        </Card>
        <Card
          className="p-6 backdrop-blur-sm bg-white/90 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
          onClick={() => navigate("/admin")}
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Management Console</h2>
            <p className="text-sm text-gray-500">
              Upload and manage documents in the knowledge base
            </p>
            <Button className="w-full">Access Console</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
