import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, RotateCcw, Sparkles, Mic, MicOff } from "lucide-react";
import { isGeminiAvailable } from "../services/geminiApi";
import { getGeminiChatResponse, resetChatSession } from "../services/geminiChatService";
import { useSpeechToText } from "../hooks/useSpeechToText";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onSpeechResult = useCallback((text: string) => {
    setInput(text);
  }, []);

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening, isProcessing: isSpeechProcessing } =
    useSpeechToText(onSpeechResult);

  const defaultQuickReplies = [
    "Payment failed",
    "Modify booking",
    "Cancellation policy",
    "Contact support",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("payment") || q.includes("pay")) {
      return "For payment issues, please check:\n1. Your card has sufficient balance\n2. You entered correct CVV\n3. OTP verification is complete\n\nIf the issue persists, contact us at +91 98765 43210 or try a different payment method.";
    } else if (q.includes("modify") || q.includes("change") || q.includes("modification")) {
      return 'To modify your booking:\n1. Go to "My Bookings"\n2. Select your booking\n3. Click "Request Modification"\n\nNote: Modifications are subject to availability and may incur charges.';
    } else if (q.includes("cancel")) {
      return 'Cancellation Policy:\n- 30+ days before travel: 90% refund\n- 15-29 days: 50% refund\n- 7-14 days: 25% refund\n- Less than 7 days: No refund\n\nTo cancel, visit "My Bookings" and click "Cancel Booking".';
    } else if (q.includes("contact") || q.includes("support")) {
      return "Contact our support team:\nPhone: +91 98765 43210\nEmail: support@smarttravel.com\nHours: 9 AM - 9 PM IST\n\nWould you like to request a callback?";
    } else if (q.includes("refund")) {
      return "Refunds are processed within 7-10 business days to the original payment method. You will receive an email confirmation once the refund is initiated.";
    } else {
      return "I can help you with:\n- Payment issues\n- Booking modifications\n- Cancellation policy\n- Contacting support\n\nPlease let me know what you need help with!";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setDynamicSuggestions([]);

    try {
      let botText: string;
      let suggestions: string[] = [];

      if (isGeminiAvailable()) {
        const history = [...messages, userMessage].map((m) => ({
          role: m.sender === "user" ? ("user" as const) : ("bot" as const),
          text: m.text,
        }));

        const result = await getGeminiChatResponse(currentInput, history);
        botText = result.response;
        suggestions = result.suggestions;
      } else {
        // Simulate delay for fallback
        await new Promise((r) => setTimeout(r, 500));
        botText = getFallbackResponse(currentInput);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setDynamicSuggestions(suggestions);
    } catch {
      // Fallback on error
      const fallback = getFallbackResponse(currentInput);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: fallback,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
  };

  const handleNewConversation = () => {
    resetChatSession();
    setMessages([
      {
        id: "1",
        text: "Hello! How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setDynamicSuggestions([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-white hover:text-lilac-600 text-gray-900 p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 z-50 border border-gray-100">
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  const showDefaultSuggestions = messages.length === 1 && dynamicSuggestions.length === 0;
  const showDynamicSuggestions = dynamicSuggestions.length > 0 && !isTyping;

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] md:w-[28rem] bg-white rounded-[2.5rem] shadow-2xl z-50 flex flex-col h-[600px] overflow-hidden border border-gray-100 transition-all duration-500 origin-bottom-right">
      {/* Header */}
      <div className="px-8 py-6 bg-white z-10 border-b border-gray-50 flex justify-between items-start">
        <div>
          <h3 className="font-kugile italic text-3xl text-gray-900 leading-tight">Need Help?</h3>
          <p className="text-lilac-900/70 text-xs mt-2 font-medium tracking-wide italic">
            {isGeminiAvailable() ? "AI-powered travel assistant" : "We typically reply in a few minutes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewConversation}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-full"
            title="New conversation">
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 no-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                message.sender === "user"
                  ? "bg-gray-900 text-white rounded-tr-none"
                  : "bg-white text-gray-600 border border-gray-100 rounded-tl-none"
              }`}>
              <p className="whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-lilac-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-lilac-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-lilac-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {(showDefaultSuggestions || showDynamicSuggestions) && (
        <div className="px-6 py-4 bg-white border-t border-gray-50">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">
            {showDynamicSuggestions ? "Follow up:" : "Suggested topics:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {(showDynamicSuggestions ? dynamicSuggestions : defaultQuickReplies).map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-white border border-gray-200 hover:border-lilac-600 hover:text-lilac-600 text-gray-600 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-50 bg-white">
        <div className="flex items-center bg-gray-50 rounded-full px-2 py-2 border border-gray-100 focus-within:border-lilac-300 focus-within:ring-4 focus-within:ring-lilac-100 transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-sm text-gray-900 placeholder-gray-400 disabled:opacity-50"
          />
          {isSpeechSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isTyping || isSpeechProcessing}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : isSpeechProcessing
                  ? "bg-lilac-100 text-lilac-600 animate-pulse"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              title={isListening ? "Stop recording" : isSpeechProcessing ? "Transcribing..." : "Voice input"}>
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-full transition-all duration-300 ${
              input.trim() && !isTyping
                ? "bg-gray-900 text-white hover:bg-lilac-600 hover:scale-105 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            <Send className="h-4 w-4" />
          </button>
        </div>
        {isGeminiAvailable() && (
          <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-gray-400">
            <Sparkles className="h-3 w-3" />
            Powered by Gemini AI
          </div>
        )}
      </div>
    </div>
  );
}
