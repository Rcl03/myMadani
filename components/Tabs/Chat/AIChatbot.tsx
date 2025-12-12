
import React, { useState, useEffect, useRef } from 'react';
import { Mic, ArrowUp, MapPin, Globe, Sparkles, StopCircle, User, Volume2, X, Bot } from 'lucide-react';
import { generateChatResponse } from '../../../services/geminiService';
import { ChatMessage } from '../../../types';
import { STRINGS } from '../../../constants';

interface AIChatbotProps {
  lang: 'ms' | 'en' | 'zh' | 'ta';
  onOpenProgram: (id: string, action?: 'view' | 'payment') => void;
}

// --- AVATAR ASSETS (Cascade System) ---
// 1. Primary: Malay Girl 3D Model (GLB)
const AVATAR_PRIMARY = "/malay_girl.glb";
// 2. Secondary: Robot Expressive (WebP - Lightweight 3D Render)
const AVATAR_SECONDARY = "https://modelviewer.dev/shared-assets/models/RobotExpressive.webp";
// 3. Fallback: DiceBear Generated Bot Avatar
const AVATAR_FALLBACK = "https://api.dicebear.com/9.x/bottts/svg?seed=MBot";


// --- Audio Decoding Helpers (Raw PCM) ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ lang, onOpenProgram }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Avatar State
  const [avatarSrc, setAvatarSrc] = useState(AVATAR_PRIMARY);
  const [imgError, setImgError] = useState(false);
  const [useModelViewer, setUseModelViewer] = useState(true); // Use model-viewer for GLB files

  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  const t = STRINGS[lang];
  const isChatStarted = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  // Handle Avatar Load Errors (Cascade)
  const handleImgError = () => {
    console.warn("Avatar load failed, switching source...");
    if (avatarSrc === AVATAR_PRIMARY) {
      setUseModelViewer(false);
      setAvatarSrc(AVATAR_SECONDARY);
    } else if (avatarSrc === AVATAR_SECONDARY) {
      setAvatarSrc(AVATAR_FALLBACK);
    } else {
      setImgError(true); // All failed, show icon
    }
  };

  // Handle Model Viewer Load Errors
  useEffect(() => {
    if (modelViewerRef.current && useModelViewer && avatarSrc === AVATAR_PRIMARY) {
      const modelViewer = modelViewerRef.current;
      const handleError = () => {
        console.warn("3D model load failed, switching to image...");
        setUseModelViewer(false);
        setAvatarSrc(AVATAR_SECONDARY);
      };
      modelViewer.addEventListener('error', handleError);
      return () => {
        modelViewer.removeEventListener('error', handleError);
      };
    }
  }, [useModelViewer, avatarSrc]);

  // Handle Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!avatarRef.current || isChatStarted) return;
    
    let clientX, clientY;
    if ('touches' in e) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
    } else {
       // @ts-ignore
       clientX = e.clientX;
       // @ts-ignore
       clientY = e.clientY;
    }

    const { left, top, width, height } = avatarRef.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 15; 
    const y = (clientY - top - height / 2) / 15;
    setTilt({ x: -x, y: y }); 
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Initialize Audio Context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playResponseAudio = async (base64Audio: string) => {
    try {
      initAudioContext();
      if (!audioContextRef.current) return;

      setIsPlayingAudio(true);
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlayingAudio(false);
      source.start(0);
    } catch (err) {
      console.error("Error playing audio:", err);
      setIsPlayingAudio(false);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    // Ensure audio context is ready on user gesture
    initAudioContext();

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Call API
    const response = await generateChatResponse(textToSend, history);
    
    // We force show the card if a program ID is returned, so the user always has a link
    const showCard = !!response.relatedProgramId;

    const botMessage: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response.text,
      isEligibilityCard: showCard,
      groundingMetadata: response.groundingMetadata,
      relatedProgramId: response.relatedProgramId
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

    if (response.audioData) {
      playResponseAudio(response.audioData);
    }

    // --- AUTOMATION LOGIC ---
    if (response.relatedProgramId && response.action === 'payment') {
      setTimeout(() => {
         onOpenProgram(response.relatedProgramId!, response.action);
      }, 1500);
    }
  };

  const toggleListening = () => {
    initAudioContext();
    
    // Toggle off if already on
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Start "Mock" Listening
    setIsListening(true);
    
    // Simulate delay then auto-send based on context
    setTimeout(() => {
      setIsListening(false);
      
      const mockPrompt = messages.length === 0 
        ? "Check my STR eligibility status." 
        : "Open QR payment.";

      handleSend(mockPrompt);
    }, 2000);
  };

  const suggestions = [
    t.suggestion_str,
    t.suggestion_sara,
    t.suggestion_petrol,
    t.suggestion_history
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] relative overflow-hidden font-sans" onMouseMove={handleMouseMove} onTouchMove={handleMouseMove} onMouseLeave={resetTilt}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-8px) rotateX(2deg); }
        }
        @keyframes speaking-bounce {
            0% { transform: scale(1) translateY(0); }
            25% { transform: scale(1.05) translateY(-2px); }
            50% { transform: scale(1) translateY(0); }
            75% { transform: scale(1.02) translateY(-1px); }
            100% { transform: scale(1) translateY(0); }
        }
        .animate-float-3d {
          animation: float 6s ease-in-out infinite;
        }
        .animate-speaking-aggressive {
           animation: speaking-bounce 0.4s ease-in-out infinite;
        }
        .perspective-container {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* 1. Avatar Stage (Dynamic Header) */}
      <div 
        role="banner"
        aria-label="AI Assistant Avatar"
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isChatStarted ? 'pt-2 h-20 shrink-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'justify-center h-[55%] pt-0 bg-gradient-to-b from-blue-50/50 via-[#F8F9FA] to-[#F8F9FA]'}`}
      >
         
         {/* The Avatar Container */}
         <div 
            ref={avatarRef}
            className={`perspective-container relative transition-all duration-700 ${isChatStarted ? 'w-14 h-14 mt-1' : 'w-48 h-48'}`}
            aria-hidden="true" // Visual only
         >
            {/* Holographic Platform Shadow (Only in Hero Mode) */}
            {!isChatStarted && (
              <div 
                className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-32 h-8 bg-black/20 rounded-[100%] blur-xl transition-transform duration-200"
                style={{
                  transform: `translateX(-50%) rotateX(60deg) translate(${tilt.x * -2}px, ${tilt.y * -2}px)`
                }}
              />
            )}

            {/* Avatar Image with 3D Transforms */}
            <div 
               className={`w-full h-full preserve-3d transition-transform duration-200 ease-out ${!isChatStarted ? 'animate-float-3d' : ''} ${isPlayingAudio ? 'animate-speaking-aggressive' : ''}`}
               style={{
                  transform: isChatStarted 
                    ? 'none' 
                    : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${1 + Math.abs(tilt.x)/50})`
               }}
            >
               {!imgError ? (
                  useModelViewer && avatarSrc === AVATAR_PRIMARY ? (
                     // Use model-viewer for GLB 3D model
                     // @ts-ignore - model-viewer is loaded via script tag
                     <model-viewer
                        ref={modelViewerRef}
                        src={avatarSrc}
                        alt="Marina - AI Assistant"
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls
                        disable-zoom
                        auto-rotate
                        rotation-per-second="30deg"
                        style={{
                           width: '100%',
                           height: '100%',
                           backgroundColor: 'transparent'
                        }}
                     />
                  ) : (
                     <img 
                        src={avatarSrc} 
                        alt="Marina - AI Assistant" 
                        onError={handleImgError}
                        className="w-full h-full object-contain drop-shadow-2xl" 
                     />
                  )
               ) : (
                  // Fallback to Icon if all images fail
                  <div className={`w-full h-full bg-gradient-to-br from-indigo-300 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white`}>
                     <Bot size={isChatStarted ? 32 : 100} strokeWidth={1.5} />
                  </div>
               )}
            </div>
            
            {/* Listening Indicator */}
            {isListening && (
              <div className="absolute -right-1 -bottom-1 bg-red-500 text-white p-1 rounded-full animate-pulse border-2 border-white shadow-md z-20">
                 <Mic size={12} />
              </div>
            )}
         </div>

         {/* Text/Greeting - Fades out in compact mode */}
         <div className={`text-center transition-all duration-500 ${isChatStarted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mt-6'}`}>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{t.ai_greeting}</h2>
            <p className="text-gray-500 font-medium">{t.ai_subtitle}</p>
         </div>

         {/* Compact Mode Name */}
         <div className={`transition-all duration-500 flex items-center space-x-2 ${isChatStarted ? 'opacity-100 mt-1 scale-100' : 'opacity-0 h-0 scale-90 overflow-hidden'}`}>
             <span className="font-bold text-gray-900">Marina</span>
             <div className={`w-1.5 h-1.5 rounded-full ${isPlayingAudio ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
         </div>
      </div>

      {/* 2. Messages & Suggestions Area */}
      <div 
        className={`flex-1 overflow-y-auto no-scrollbar relative z-0 transition-all duration-700 ${isChatStarted ? 'px-4 pt-4' : 'px-6'}`}
        role="log"
        aria-live="polite" // Important: Announces new messages automatically
        aria-label="Chat History"
      >
         
         {/* Suggestions (Hero Mode) */}
         {!isChatStarted && (
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mt-8 animate-slide-up" role="list">
              {suggestions.map((s, i) => (
                 <button 
                   key={i} 
                   role="listitem"
                   onClick={() => handleSend(s)}
                   className="text-left p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-xs font-bold text-gray-700 shadow-sm group relative overflow-hidden active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   aria-label={`Ask Marina: ${s}`}
                 >
                   <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles size={24} className="text-blue-600" />
                   </div>
                   {s}
                 </button>
              ))}
            </div>
         )}

         {/* Chat List */}
         {isChatStarted && (
           <div className="space-y-6 pb-4">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex w-full animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                     
                     {/* Chat Bubbles */}
                     <div 
                       className={`text-[15px] leading-relaxed shadow-sm ${
                         msg.role === 'user' 
                         ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm px-5 py-3' 
                         : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4'
                       }`}
                       tabIndex={0} // Make bubble focusable so screen reader can read it explicitly if user navigates back
                     >
                       {msg.text}
                     </div>

                     {/* Grounding Content (Maps / Web) */}
                     {msg.groundingMetadata?.groundingChunks && (
                         <div className="mt-3 flex flex-col gap-2 w-full max-w-xs">
                             {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                                 if (chunk.maps) {
                                     return (
                                          <a key={i} href={chunk.maps.googleMapsUri} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group block no-underline shadow-sm focus:ring-2 focus:ring-blue-500">
                                             <div className="p-3 flex items-center gap-3">
                                                  <div className="bg-red-50 w-8 h-8 rounded-lg text-red-500 shrink-0 flex items-center justify-center">
                                                     <MapPin size={16} fill="currentColor" />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                      <p className="font-bold text-gray-900 text-xs truncate">Map: {chunk.maps.title}</p>
                                                      <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="text-[10px] text-gray-500 truncate block">{chunk.maps.address}</span>
                                                      </div>
                                                  </div>
                                             </div>
                                          </a>
                                     )
                                 }
                                 if (chunk.web) {
                                     return (
                                         <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-sm text-sm no-underline focus:ring-2 focus:ring-blue-500">
                                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0"><Globe size={16} /></div>
                                             <div className="flex-1 min-w-0">
                                                 <p className="font-bold text-gray-900 truncate text-xs">Web: {chunk.web.title}</p>
                                             </div>
                                         </a>
                                     )
                                 }
                                 return null;
                             })}
                         </div>
                     )}
                     
                     {/* Eligibility Card */}
                     {msg.isEligibilityCard && (
                       <div 
                         className="mt-3 w-full bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden animate-slide-up transform hover:scale-[1.02] transition-transform"
                         role="region"
                         aria-label={`${msg.relatedProgramId} Eligibility Card`}
                       >
                         <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white relative overflow-hidden">
                           <Sparkles size={60} className="absolute -top-2 -right-4 text-white/10" aria-hidden="true" />
                           <div className="flex items-center space-x-2 mb-1 relative z-10">
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Verified</span>
                           </div>
                           <h3 className="font-bold text-lg relative z-10">{msg.relatedProgramId === 'str' ? 'STR 2024' : msg.relatedProgramId === 'sara' ? 'SARA Credit' : 'Subsidy Approved'}</h3>
                         </div>
                         <div className="p-4">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-2xl font-black text-gray-900">{msg.relatedProgramId === 'sara' ? 'RM 100' : 'RM 300'}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase">/ Month</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Eligibility confirmed via PADU</p>
                            <button 
                               onClick={() => msg.relatedProgramId && onOpenProgram(msg.relatedProgramId)}
                               className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                               aria-label={`Open wallet for ${msg.relatedProgramId}`}
                            >
                               Open Wallet <ArrowUp size={14} className="rotate-45" />
                            </button>
                         </div>
                       </div>
                     )}
                  </div>
               </div>
             ))}

             {isLoading && (
               <div className="flex justify-start w-full" role="status" aria-live="polite" aria-label="Marina is thinking">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-2">
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>
         )}
      </div>

      {/* 3. Input Area (Floating) */}
      <div className="shrink-0 px-4 pt-2 pb-6 bg-[#F8F9FA] z-30">
         <div className="bg-white rounded-[2rem] p-1.5 flex items-end shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-200 transition-shadow focus-within:shadow-md">
            <div className="p-2">
              <button 
                className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Upload image or file"
                onClick={() => setInput('')} // Clear input as simple action
              >
                 {input.length > 0 ? (
                    <X size={20} className="text-gray-500" />
                 ) : (
                    <span className="text-2xl leading-none mb-1" aria-hidden="true">+</span>
                 )}
              </button>
            </div>
            
            <textarea 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => {
                 if(e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSend();
                 }
               }}
               placeholder={isListening ? t.listening : t.input_placeholder}
               aria-label="Type a message to Marina"
               className={`flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-900 placeholder-gray-400 resize-none py-3.5 max-h-32 ${isListening ? 'animate-pulse' : ''}`}
               rows={1}
            />

            {input.trim() ? (
               <button 
                 onClick={() => handleSend()}
                 className="m-1 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                 aria-label="Send message"
               >
                 <ArrowUp size={20} strokeWidth={2.5} />
               </button>
            ) : (
               <button 
                 onClick={toggleListening}
                 className={`m-1 w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${isListening ? 'bg-red-500 text-white shadow-red-200 shadow-lg scale-110 focus:ring-red-500' : 'text-gray-900 hover:bg-gray-100 focus:ring-gray-300'}`}
                 aria-label={isListening ? "Stop listening" : "Start voice input"}
                 aria-pressed={isListening}
               >
                 {isListening ? <StopCircle size={24} /> : <Mic size={24} />}
               </button>
            )}
         </div>
      </div>
      
      {/* 4. Spacer for Bottom Navigation */}
      <div className="h-20 shrink-0 bg-[#F8F9FA]" />
    </div>
  );
};

export default AIChatbot;
