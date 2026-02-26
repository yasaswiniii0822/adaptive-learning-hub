import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const botResponses: Record<string, string> = {
  hello: "Hi there! 👋 I'm VidyaBot, your learning assistant. How can I help you today?",
  help: "I can help you with:\n• Finding courses for your subjects\n• Understanding your learning path\n• Adjusting difficulty levels\n• Answering questions about board exams, JEE, NEET\n\nJust ask away!",
  recommend: "Based on your profile, I'd suggest focusing on your weakest subjects first. Check your Dashboard for personalized recommendations tailored to your board and class level.",
  jee: "For JEE preparation, I recommend a structured approach: start with NCERT concepts, then move to problem-solving with HC Verma (Physics), RD Sharma (Maths), and OP Tandon (Chemistry). Your learning path has been customized for this!",
  neet: "For NEET, focus on Biology (both Botany & Zoology), Physics, and Chemistry. NCERT is your Bible! I've curated video resources and practice tests in your dashboard.",
  difficult: "No worries! You can adjust the difficulty and pace from the Feedback page. I'll recalibrate your recommendations to match your comfort level. 💪",
  progress: "You can track your progress on the Dashboard. Each subject shows completion percentage and your learning path shows what's next!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return botResponses.hello;
  if (lower.includes('help') || lower.includes('what can you')) return botResponses.help;
  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('course')) return botResponses.recommend;
  if (lower.includes('jee')) return botResponses.jee;
  if (lower.includes('neet')) return botResponses.neet;
  if (lower.includes('difficult') || lower.includes('hard') || lower.includes('easy') || lower.includes('pace')) return botResponses.difficult;
  if (lower.includes('progress') || lower.includes('track')) return botResponses.progress;
  return "That's a great question! While I'm a demo assistant, in the full version I'd use AI to give you a detailed answer. Try asking about JEE, NEET, recommendations, or your progress!";
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: "Hi! 👋 I'm VidyaBot. Ask me anything about your learning journey!", timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const botMsg: Message = { id: crypto.randomUUID(), role: 'bot', text: getBotResponse(userMsg.text), timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setOpen(!open)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground"
        >
          {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] rounded-xl border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b bg-primary px-4 py-3">
              <Bot className="h-6 w-6 text-primary-foreground" />
              <div>
                <p className="font-heading font-semibold text-primary-foreground text-sm">VidyaBot</p>
                <p className="text-xs text-primary-foreground/70">Your AI Learning Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'bot' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent">
                        <User className="h-4 w-4 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask VidyaBot..."
                className="flex-1 text-sm"
              />
              <Button size="icon" onClick={send} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
