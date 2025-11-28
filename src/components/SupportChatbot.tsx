import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

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

  const quickReplies = [
    "Payment failed",
    "Modify booking",
    "Cancellation policy",
    "Contact support",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse = getBotResponse(input.toLowerCase());
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  const getBotResponse = (query: string): string => {
    if (query.includes("payment") || query.includes("pay")) {
      return "For payment issues, please check:\n1. Your card has sufficient balance\n2. You entered correct CVV\n3. OTP verification is complete\n\nIf the issue persists, contact us at +91 98765 43210 or try a different payment method.";
    } else if (
      query.includes("modify") ||
      query.includes("change") ||
      query.includes("modification")
    ) {
      return 'To modify your booking:\n1. Go to "My Bookings"\n2. Select your booking\n3. Click "Request Modification"\n\nNote: Modifications are subject to availability and may incur charges.';
    } else if (query.includes("cancel")) {
      return 'Cancellation Policy:\n- 30+ days before travel: 90% refund\n- 15-29 days: 50% refund\n- 7-14 days: 25% refund\n- Less than 7 days: No refund\n\nTo cancel, visit "My Bookings" and click "Cancel Booking".';
    } else if (query.includes("contact") || query.includes("support")) {
      return "Contact our support team:\n📞 Phone: +91 98765 43210\n📧 Email: support@smarttravel.com\n⏰ Hours: 9 AM - 9 PM IST\n\nWould you like to request a callback?";
    } else if (query.includes("refund")) {
      return "Refunds are processed within 7-10 business days to the original payment method. You will receive an email confirmation once the refund is initiated.";
    } else {
      return "I can help you with:\n- Payment issues\n- Booking modifications\n- Cancellation policy\n- Contacting support\n\nPlease let me know what you need help with!";
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
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

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 bg-white rounded-[2.5rem] shadow-2xl z-50 flex flex-col h-[600px] overflow-hidden border border-gray-100 transition-all duration-500 origin-bottom-right">
      {/* Header */}
      <div className="px-8 py-6 bg-white z-10 border-b border-gray-50 flex justify-between items-start">
        <div>
          <h3 className="font-kugile italic text-3xl text-gray-900 leading-tight">Need Help?</h3>
          <p className="text-lilac-900/70 text-xs mt-2 font-medium tracking-wide italic ">
            We typically reply in a few minutes
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-full">
          <X className="h-6 w-6" />
        </button>
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
      </div>

      {messages.length === 1 && (
        <div className="px-6 py-4 bg-white border-t border-gray-50">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">
            Suggested topics:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
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
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-sm text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all duration-300 ${
              input.trim()
                ? "bg-gray-900 text-white hover:bg-lilac-600 hover:scale-105 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
