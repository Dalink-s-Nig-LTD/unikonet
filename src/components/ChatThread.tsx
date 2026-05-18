import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreVertical, Plus, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const ChatThread = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { toast } = useToast();
  
  const { 
    chats, 
    sendMessage 
  } = useAppStore();

  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find exact chat thread or fallback to first chat
  const chat = chats.find(c => c.id === Number(chatId)) || chats[0];

  useEffect(() => {
    // Scroll to bottom on load or new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Conversation Not Found</h3>
        <p className="text-sm text-muted-foreground mb-4">This chat group or thread may have been archived.</p>
        <Button onClick={() => navigate("/chat")} className="rounded-xl">Go Back to Chats</Button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    sendMessage(chat.id, messageText.trim());
    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 font-inter flex flex-col">
      {/* Header */}
      <div className="bg-card/85 backdrop-blur-xl shadow-sm px-6 py-5 sticky top-0 z-10 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/chat")}
              className="p-2.5 hover:bg-accent rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative cursor-pointer" onClick={() => !chat.isGroup && navigate(`/user/${chat.name}`)}>
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-primary/20"
              />
              {!chat.isGroup && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-base font-extrabold text-foreground cursor-pointer" onClick={() => !chat.isGroup && navigate(`/user/${chat.name}`)}>
                {chat.name}
              </h1>
              {!chat.isGroup ? (
                <span className="text-xs text-green-500 font-semibold">Active now</span>
              ) : (
                <span className="text-xs text-muted-foreground font-medium">Group Chatroom</span>
              )}
            </div>
          </div>
          <button 
            onClick={() => toast({ title: "Options", description: "Chat encryption details and notification preferences verified." })}
            className="p-2.5 hover:bg-accent rounded-2xl transition-all duration-200 text-foreground"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 px-6 py-6 space-y-6 pb-24 overflow-y-auto">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOutgoing ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className="max-w-[280px]">
              <div
                className={`p-3.5 rounded-3xl shadow-sm transition-all duration-200 hover:shadow-md ${
                  msg.isOutgoing
                    ? 'bg-primary text-primary-foreground rounded-br-lg'
                    : 'bg-card border border-border text-foreground rounded-bl-lg'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 px-2 text-right">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {chat.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-16 space-y-2">
            <p className="text-sm font-semibold">Start of Conversation</p>
            <p className="text-xs max-w-[220px]">
              Send a secure message. All campus chats are encrypted.
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-card/90 backdrop-blur-xl border-t border-border/50 px-6 py-4 sticky bottom-0 z-20">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => toast({ title: "Media Sharing", description: "Camera, gallery, and file attachments enabled." })}
            className="p-3 hover:bg-accent rounded-2xl transition-all text-muted-foreground shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 relative flex items-center">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a secure message..."
              className="rounded-3xl border-border/50 pr-14 h-12 text-sm bg-background/50 backdrop-blur-sm focus:bg-background transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="absolute right-2 p-2 bg-primary rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;