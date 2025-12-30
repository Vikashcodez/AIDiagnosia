
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { MessageCircle, Loader2, Bot, User } from "lucide-react";
import { getMedicalAnalysis } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

export function HealthChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'assistant', 
      content: "Hello! I'm your AI health assistant. How can I help you today? You can ask me any health-related questions." 
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
      const response = await getMedicalAnalysis(userMessage);
      
      // Format the response for the chat
      let chatResponse = response.analysis;
      
      if (response.possibleConditions && response.possibleConditions.length > 0) {
        chatResponse += "\n\nPossible conditions to consider: " + 
          response.possibleConditions.join(", ");
      }
      
      if (response.recommendations && response.recommendations.length > 0) {
        chatResponse += "\n\nRecommendations: \n- " + 
          response.recommendations.join("\n- ");
      }
      
      // Add assistant's response to chat
      setMessages(prev => [...prev, { type: 'assistant', content: chatResponse }]);
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
    <div className="fixed bottom-6 right-6 z-50">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="rounded-full h-14 w-14 shadow-lg bg-medical-500 hover:bg-medical-600" size="icon">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[70vh] sm:h-[65vh]">
          <DrawerHeader className="border-b pb-2">
            <DrawerTitle className="flex items-center text-xl">
              <Bot className="mr-2 text-medical-500" /> Health Assistant (24/7)
            </DrawerTitle>
            <DrawerDescription>
              Ask any health-related questions for quick guidance
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-16">
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
                    {message.type === 'user' ? 'You' : 'Health Assistant'}
                    {message.type === 'user' ? (
                      <User className="ml-1 h-3 w-3" />
                    ) : (
                      <Bot className="mr-1 h-3 w-3" />
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
          
          <DrawerFooter className="absolute bottom-0 left-0 right-0 border-t bg-white pt-2">
            <div className="flex items-center space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question..."
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
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
