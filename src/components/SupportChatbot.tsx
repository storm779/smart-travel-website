import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, RotateCcw, Sparkles, Mic, MicOff, Bot } from "lucide-react";
import { isGeminiAvailable } from "../services/geminiApi";
import { getGeminiChatResponse, resetChatSession } from "../services/geminiChatService";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <Button
        onClick={() => setIsOpen(true)}
        size="icon-lg"
        variant="outline"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-background text-foreground shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 z-50">
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  const showDefaultSuggestions = messages.length === 1 && dynamicSuggestions.length === 0;
  const showDynamicSuggestions = dynamicSuggestions.length > 0 && !isTyping;

  return (
    <Card className="fixed bottom-6 right-6 w-[90vw] md:w-[28rem] rounded-[2.5rem] shadow-2xl z-50 flex flex-col h-[600px] overflow-hidden transition-all duration-500 origin-bottom-right gap-0 py-0">
      {/* Header */}
      <CardHeader className="px-8 py-6 bg-card border-b border-border/50 flex flex-row justify-between items-start gap-4">
        <div>
          <h3 className="font-kugile italic text-3xl text-foreground leading-tight">Need Help?</h3>
          <p className="text-muted-foreground text-xs mt-2 font-medium tracking-wide italic">
            {isGeminiAvailable() ? "AI-powered travel assistant" : "We typically reply in a few minutes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleNewConversation}
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-muted-foreground hover:text-foreground"
            title="New conversation">
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                {message.sender === "bot" && (
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground border border-border/50 rounded-tl-none"
                  }`}>
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted border border-border/50 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Suggestions */}
      {(showDefaultSuggestions || showDynamicSuggestions) && (
        <>
          <Separator />
          <div className="px-6 py-4 bg-card">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">
              {showDynamicSuggestions ? "Follow up:" : "Suggested topics:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(showDynamicSuggestions ? dynamicSuggestions : defaultQuickReplies).map((reply) => (
                <Badge
                  key={reply}
                  variant="outline"
                  onClick={() => handleQuickReply(reply)}
                  className="cursor-pointer px-4 py-2 h-auto text-xs font-normal hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
                  {reply}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      <CardFooter className="flex-col gap-2 p-4 border-t border-border/50 bg-card">
        <div className="flex items-center gap-2 w-full bg-muted rounded-full px-2 py-2 border border-border/50 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/20 transition-all duration-300">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1 border-0 bg-transparent px-4 py-2 focus-visible:ring-0 focus-visible:border-transparent text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 h-auto"
          />
          {isSpeechSupported && (
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isTyping || isSpeechProcessing}
              variant="ghost"
              size="icon-sm"
              className={`rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : isSpeechProcessing
                  ? "bg-primary/10 text-primary animate-pulse"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={isListening ? "Stop recording" : isSpeechProcessing ? "Transcribing..." : "Voice input"}>
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon-sm"
            className={`rounded-full transition-all duration-300 ${
              input.trim() && !isTyping
                ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105 shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isGeminiAvailable() && (
          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            Powered by Gemini AI
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
