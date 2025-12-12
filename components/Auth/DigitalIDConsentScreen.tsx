import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ShieldCheck, QrCode } from 'lucide-react';

interface DigitalIDConsentScreenProps {
  onConfirm: () => void;
}

const DigitalIDConsentScreen: React.FC<DigitalIDConsentScreenProps> = ({ onConfirm }) => {
  // Start at 2 minutes 57 seconds (177 seconds)
  const [timeLeft, setTimeLeft] = useState(177);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} MINUTES ${s} SECONDS`;
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white relative shadow-md shrink-0">
        
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-medium opacity-90">
          <span>9:41</span>
          <div className="flex items-center space-x-2">
            <Signal size={12} fill="currentColor" />
            <Wifi size={12} />
            <div className="relative">
               <Battery size={14} />
               <div className="absolute top-0.5 right-0.5 h-2 w-0.5 bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Banner Content */}
        <div className="px-6 pb-6 pt-2 relative overflow-hidden">
             {/* Subtle Flag Motif Overlay */}
             <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffffff_10px,#ffffff_20px)] pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col items-center text-center">
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-200 mb-1">MyGOV Login</p>
                 <p className="font-bold text-sm tracking-wide">Connecting to MyDigital ID...</p>
             </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative w-full max-w-md mx-auto">
          
          {/* Logo Section */}
          <div className="mb-10 text-center animate-fade-in flex flex-col items-center">
             <div className="flex items-center justify-center mb-3">
                 {/* Styled Logo Icon */}
                 <div className="mr-3 p-1 rounded-lg">
                    <ShieldCheck size={48} className="text-blue-700" />
                 </div>
                 {/* Styled Text Logo */}
                 <div className="text-left leading-none flex items-baseline">
                    <span className="text-3xl font-black text-blue-900 tracking-tighter">my</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">digital</span>
                    <span className="text-3xl font-black text-yellow-500 tracking-tighter">ID</span>
                 </div>
             </div>
             <h2 className="text-xl font-bold text-gray-800 tracking-[0.3em] uppercase mt-2">Login</h2>
          </div>

          {/* Session Timer */}
          <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-8 shadow-sm">
             <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest mb-1.5">Session Will Expire In</p>
             <p className="text-xl font-black text-yellow-800 tabular-nums tracking-tight">
                {formatTime(timeLeft)}
             </p>
          </div>

          {/* Confirmation Box */}
          <div className="w-full bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 text-center space-y-8 animate-slide-up">
             <p className="text-gray-900 font-bold text-lg leading-snug">
               Are you sure you want to begin your digital ID verification?
             </p>
             
             <div className="space-y-4">
                <button 
                  onClick={onConfirm}
                  className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-700/20 hover:bg-blue-800 active:scale-95 transition-all text-sm tracking-wide"
                >
                  YES
                </button>
                <button 
                  className="w-full bg-transparent text-gray-700 border-2 border-gray-200 font-bold py-4 rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-sm tracking-wide"
                >
                  <QrCode size={18} className="mr-2.5 text-gray-500" />
                  SHOW QR CODE
                </button>
             </div>
          </div>
      </div>

      {/* Footer */}
      <div className="p-8 text-center shrink-0">
         <p className="text-xs text-gray-400 font-medium">Protect your digital identity with MyDigital ID</p>
      </div>
    </div>
  );
};

export default DigitalIDConsentScreen;