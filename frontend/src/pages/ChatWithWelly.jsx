import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Sparkles, Send, Heart } from "lucide-react";
import api from "../services/api";

export default function ChatWithWelly() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    // load history
    let mounted = true;
    (async () => {
      try {
        const res = await api.chat.getHistory();
        if (mounted && res && res.messages) {
          setMessages(res.messages || []);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
  };

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    const optimistic = [...messages, { sender: "user", text }];
    setMessages(optimistic);
    setInput("");
    scrollToBottom();
    setLoading(true);
    try {
      const res = await api.chat.sendMessage(text);
      const replyText = res && (res.reply || res.data && res.data.reply) || "Sorry, I couldn't respond.";
      setMessages(prev => [...prev, { sender: "welly", text: replyText }]);
      scrollToBottom();
    } catch (err) {
      console.error("chat send error:", err);
      setMessages(prev => [...prev, { sender: "welly", text: "Sorry — something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div 
      className="min-h-screen relative bg-cover bg-repeat bg-center bg-fixed"
      style={{ backgroundImage: 'url("bg5.jpg")' }}
    >
      {/* Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#F0EEEA]/30" />
      
      {/* Content Container */}
      <div className="relative z-10 pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-[#486856]">
                Chat with Welly
              </h1>
            </div>
            <p className="text-lg text-[#6B8E7A] max-w-2xl mx-auto leading-relaxed">
              Your compassionate AI companion is here to listen, support, and guide you on your wellness journey
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-[#97B3AE]/20">
            {/* Chat Window */}
            <div className="h-[60vh] overflow-y-auto p-6 space-y-4" data-testid="chat-window">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F2C3B9] to-[#F0DDD6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-[#486856]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#486856] mb-2">Welcome to your safe space</h3>
                  <p className="text-[#6B8E7A] max-w-md mx-auto">
                    Share what's on your mind. Welly is here to listen without judgment and offer gentle guidance.
                  </p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] text-white' 
                      : 'bg-gradient-to-br from-[#F2C3B9] to-[#F0DDD6] text-[#486856]'
                  }`}>
                    <div className="leading-relaxed">{m.text}</div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-[#F2C3B9] to-[#F0DDD6] text-[#486856] px-5 py-3 rounded-2xl shadow-sm max-w-[75%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#486856] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#486856] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#486856] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm">Welly is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-gradient-to-r from-[#F0EEEA]/50 to-[#D6CBBF]/50 border-t border-[#97B3AE]/20">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Share what's on your mind... Press Enter to send"
                    className="w-full p-4 rounded-2xl border border-[#97B3AE]/30 bg-white/80 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#97B3AE]/50 focus:border-transparent placeholder-[#6B8E7A]/60 text-[#486856]"
                    rows="3"
                  />
                  <div className="flex items-center justify-between mt-2 px-1">
                    <div className="text-sm text-[#6B8E7A] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Welly listens with compassion and understanding</span>
                    </div>
                    <div className="text-xs text-[#97B3AE]">
                      {input.length}/1000
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] hover:from-[#D2E0D3] hover:to-[#97B3AE] text-white p-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#6B8E7A]/80 max-w-md mx-auto">
              Your conversations with Welly are private and secure. Take your time and share at your own pace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}