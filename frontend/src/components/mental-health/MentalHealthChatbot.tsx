
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Brain, User } from "lucide-react";
import { getMentalHealthResponse } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

export function MentalHealthChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'assistant', 
      content: "Hello! I'm here to provide mental health support. How are you feeling today? You can ask me about stress, anxiety, sleep problems, or any other mental health concerns." 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    
    const userMessage = inputValue;
    setInputValue("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Get response from Gemini API
      const response = await getMentalHealthResponse(userMessage);
      
      // Add assistant's response to chat
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again." 
      }]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 mr-2 text-medical-500" />
          <h2 className="text-xl font-semibold">Mental Health Assistant</h2>
        </div>
        <Separator className="mb-4" />
        
        <div className="h-[400px] overflow-y-auto mb-4 p-2 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-medical-100 text-gray-800 rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <div className={`flex items-center mb-1 text-xs font-semibold ${
                  message.type === 'user' ? 'justify-end text-medical-600' : 'text-gray-600'
                }`}>
                  {message.type === 'user' ? 'You' : 'Mental Health Assistant'}
                  {message.type === 'user' ? (
                    <User className="ml-1 h-3 w-3" />
                  ) : (
                    <Brain className="mr-1 h-3 w-3" />
                  )}
                </div>
                <div className="whitespace-pre-line text-sm">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none">
                <Loader2 className="h-5 w-5 animate-spin text-medical-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question about mental health..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || inputValue.trim() === ""}
            className="bg-medical-500 hover:bg-medical-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 italic">
          Note: This is an AI assistant and not a substitute for professional mental health care.
          If you're experiencing a crisis, please call a mental health helpline or seek immediate professional help.
        </p>
      </CardContent>
    </Card>
  );
}
