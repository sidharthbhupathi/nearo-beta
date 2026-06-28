import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Bot, 
  CheckCheck, 
  MapPin, 
  Award, 
  Sparkles, 
  Flame, 
  Calendar,
  Volume2,
  VolumeX,
  PhoneCall
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  imageUrl?: string;
  isInteractiveCard?: boolean;
  scoreCard?: {
    storeName: string;
    visibility: number;
    platformCount: number;
  };
}

export const WhatsAppMockup: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [muteSound, setMuteSound] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Play realistic WhatsApp double click beep or chirp if not muted
  const playPing = () => {
    if (muteSound) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // AudioContext fails gracefully inside sandbox without errors
    }
  };

  const initialSetup = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Namaste! Welcome to NearLy Autopilot Support. I can help sync your shop details to 12 directories, generate multilingual customer ads, and fetch your visibility score.",
        timestamp: "2:45 PM"
      },
      {
        sender: "bot",
        text: "Try sending: *\"Score\"* to view your live progress report, or ask *\"Post\"* to compose a quick advertisement!",
        timestamp: "2:45 PM"
      }
    ]);
  };

  useEffect(() => {
    initialSetup();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const getResponse = (input: string) => {
    const clean = input.toLowerCase().trim();
    
    if (clean.includes("score") || clean.includes("visibility") || clean.includes("index")) {
      return {
        text: "📈 *Krishna Swadeshi Organic* is live on *7/12* search platforms!\n\n*Visibility Rating*: *65/100*\n*Status*: Great (Verified Rank in Indiranagar Area)\n\n_Auto-publishing is working beautifully in the background!_",
        scoreCard: {
          storeName: "Krishna Swadeshi Organic",
          visibility: 65,
          platformCount: 7
        }
      };
    } else if (clean.includes("post") || clean.includes("deal") || clean.includes("offer") || clean.includes("coupon")) {
      return {
        text: "✨ *NearLy Autopilot Multi-Language Lead Compose* ✨\n\n*English Deal*: Celebrate swadeshi organic ghee! 10% instant off this festival season.\n\n*Hindi Edition (हिंदी)*: स्वदेशी जैविक घी का जश्न मनाएं! इस त्योहारी सीजन में तुरंत 10% की छूट पाएं।\n\n*Share targets*: Instantly published on *Google Maps*, *Google Search Posts*, and *WhatsApp groups* successfully! Type *'Confirm'* to publish.",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
      };
    } else if (clean.includes("confirm")) {
      return {
        text: "🚀 *Broadcast Success!* Your custom Swadeshi festival deal has been uploaded on *Google Maps Local updates* and scheduled inside your NearLy Dashboard calendar! Check the visual calendar tab below to verify."
      };
    } else if (clean.includes("hi") || clean.includes("hello") || clean.includes("hey")) {
      return {
        text: "Hello! Tell me what Swadeshi marketing task you want me to do today:\n\n1. Type *\"Score\"* to see search coverage.\n2. Type *\"Post\"* to compose templates.\n3. Type *\"Help\"* to view custom commands."
      };
    } else {
      return {
        text: "🤖 I parsed your command correctly! Here is a custom quick update: *Krishna Swadeshi Organic* is functioning beautifully on our Spark Free tier without technical latency. Type *\"Score\"* for localized analytical diagnostics."
      };
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const finalVal = textToSend || inputValue;
    if (!finalVal.trim()) return;

    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: finalVal,
      timestamp: formattedTime
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    playPing();

    // Trigger typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const res = getResponse(finalVal);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: res.text,
        timestamp: formattedTime,
        imageUrl: res.imageUrl,
        scoreCard: res.scoreCard
      }]);
      playPing();
    }, 1200);
  };

  const triggerTestAlert = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Delivering test Swadeshi alert...",
        success: "WhatsApp alert simulation successfully delivered! check mock screen.",
        error: "Failed to ping."
      }
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "⚡ *Autopilot Report Summary*\n\nYour shop *\"Krishna Swadeshi Organic\"* recently received *45 search impressions* and *3 direction queries* inside Google Maps double search listings in the last 60 minutes! Autopilot score matches: *65/100*.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      }]);
      playPing();
    }, 1600);
  };

  return (
    <div id="whatsapp-mock" className="glass-card p-6 rounded-2xl border border-brand-beige bg-white shadow-sm h-[510px] flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-brand-success rounded-full animate-ping" />
            <span className="font-serif font-black text-lg text-brand-primary">WhatsApp Customer Stream</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuteSound(!muteSound)}
              className="p-1.5 rounded-lg border border-brand-beige text-brand-secondary hover:text-brand-primary cursor-pointer transition-all"
              title={muteSound ? "Unmute sounds" : "Mute sounds"}
            >
              {muteSound ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-brand-gold animate-bounce" />}
            </button>
            <span className="text-[10px] font-mono uppercase bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">
              WhatsApp API Live
            </span>
          </div>
        </div>
        <p className="text-xs text-brand-secondary leading-normal text-left">
          Simulate what customers and you receive when NearLy’s WhatsApp broadcaster transmits regional deal alerts and visibility reports automatically.
        </p>
      </div>

      {/* Beautiful High-Fidelity WhatsApp Device View */}
      <div className="flex-1 mt-4 rounded-xl border border-brand-beige bg-[#e5ddd5] dark:bg-[#0b141a] flex flex-col justify-between overflow-hidden relative shadow-inner min-h-[300px]">
        
        {/* Device Wallpapers Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
            backgroundSize: "contain"
          }}
        />

        {/* Dynamic header of the phone conversation */}
        <div className="bg-[#075e54] dark:bg-[#202c33] text-white p-3 z-10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-left">
            <div className="h-9 w-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-800 text-sm font-bold border border-teal-200">
              🇮🇳
            </div>
            <div>
              <span className="text-xs font-black block tracking-wide flex items-center gap-1">
                NearLy Autopilot Bot
                <span className="bg-emerald-500 text-[8px] text-white rounded-full p-0.5" title="Verified Profile">✓</span>
              </span>
              <span className="text-[9px] text-emerald-100/90 font-semibold">online | Swadeshi support</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={triggerTestAlert}
              className="text-xs font-bold text-brand-gold hover:text-white transition-all bg-teal-800/60 px-2.5 py-1 rounded-lg border border-teal-600/50 cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="h-3 w-3" /> Send Test Alert
            </button>
          </div>
        </div>

        {/* Scrollable conversation bubble body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 z-10 scrollbar-thin flex flex-col">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.94, y: 7 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`max-w-[85%] rounded-lg p-2.5 shadow-sm text-left ${
                  m.sender === "user"
                    ? "bg-[#dcf8c6] text-slate-800 self-end rounded-tr-none"
                    : "bg-white text-slate-800 self-start rounded-tl-none border border-slate-100"
                }`}
              >
                {/* Simulated Unsplash post photo inside WhatsApp message card */}
                {m.imageUrl && (
                  <div className="rounded-lg overflow-hidden mb-2 max-w-full border border-slate-200">
                    <img 
                      src={m.imageUrl} 
                      alt="Organic Swadeshi deal" 
                      className="w-full h-24 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Score block render card */}
                {m.scoreCard && (
                  <div className="mb-2 p-2 bg-[#f0f9f1] border border-green-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold block uppercase">NEARLY SCORE</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{m.scoreCard.storeName}</span>
                      <span className="text-sm font-black text-emerald-600">{m.scoreCard.visibility}/100</span>
                    </div>
                  </div>
                )}

                <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
                
                <div className="flex items-center justify-end gap-1 mt-1 text-[8.5px] text-slate-400 font-mono">
                  <span>{m.timestamp}</span>
                  {m.sender === "user" && <CheckCheck className="h-3.5 w-3.5 text-blue-500 inline" />}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white text-slate-500 font-medium font-mono text-[10px] py-1 px-3.5 rounded-full select-none self-start flex items-center gap-1.5 shadow-sm"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>NearLy Autopilot composing...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input box zone */}
        <div className="bg-[#f0f2f5] dark:bg-[#101a20] p-2 flex gap-1.5 items-center z-10 border-t border-brand-beige">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type 'Score', 'Post' or ask a question directly..."
            className="flex-1 bg-white p-2 text-xs rounded-lg border-0 focus:ring-1 focus:ring-brand-gold focus:outline-none placeholder-slate-400 font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            className="h-8 w-8 bg-[#128c7e] hover:bg-[#075e54] text-white rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 border-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Customer Command chips */}
      <div className="flex gap-1.5 justify-start overflow-x-auto pt-2 text-[10.5px]">
        <span className="font-mono text-brand-secondary shrink-0 font-bold self-center">Q-Picks:</span>
        <button
          onClick={() => handleSendMessage("Score")}
          className="px-2.5 py-1 bg-brand-bg/50 border border-brand-beige text-brand-primary text-xs font-bold rounded-lg hover:border-brand-gold cursor-pointer"
        >
          📈 Check Score
        </button>
        <button
          onClick={() => handleSendMessage("Post")}
          className="px-2.5 py-1 bg-brand-bg/50 border border-brand-beige text-brand-primary text-xs font-bold rounded-lg hover:border-brand-gold cursor-pointer"
        >
          ✨ Compose Post
        </button>
        <button
          onClick={() => handleSendMessage("Confirm")}
          className="px-2.5 py-1 bg-brand-bg/50 border border-brand-beige text-brand-primary text-xs font-bold rounded-lg hover:border-brand-gold cursor-pointer"
        >
          🚀 Publish Confirm
        </button>
      </div>

    </div>
  );
};
