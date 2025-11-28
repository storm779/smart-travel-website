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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

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
    } else if (query.includes("modify") || query.includes("change")) {
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
        className="fixed bottom-6 right-6 bg-lilac-600 hover:bg-lilac-700 hover:scale-105 text-white p-4 rounded-full shadow-lg transition ease-in-out duration-300 z-50">
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col max-h-[600px] overflow-hidden">
      <div className="bg-lilac-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold font-kugile">Need Help?</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-lilac-700 rounded-full p-1 transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-lilac-600 text-white rounded-tr-none"
                  : "bg-white text-gray-900 shadow rounded-tl-none"
              }`}>
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow p-3 rounded-lg flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="p-4 bg-white border-t">
          <p className="text-xs text-gray-600 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition">
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lilac-500"
          />
          <button
            onClick={handleSend}
            className="bg-lilac-600 text-white p-2 rounded-xl hover:bg-lilac-700 transition">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
