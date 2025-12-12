import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

interface MyMadaniLaunchScreenProps {
  onComplete: () => void;
}

const MyMadaniLaunchScreen: React.FC<MyMadaniLaunchScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 100);

    // Complete the redirect after a few seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="h-screen w-full bg-white relative flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Decor (Matching Login Theme) */}
      <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      {/* Main Content Container with App Open Animation */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
      >
         {/* App Icon */}
         <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center shadow-2xl mb-8 border-4 border-white ring-1 ring-gray-100 overflow-hidden">
             <img src="/applogo.png" alt="MyMadani Logo" className="w-full h-full object-contain" />
         </div>

         {/* Brand Text */}
         <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                MyMadani
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-4 animate-pulse tracking-wide">
                Returning to application...
            </p>
         </div>
      </div>
      
      {/* Bottom Legal/Version Info */}
      <div className="absolute bottom-10 text-center z-10 opacity-40">
         <p className="text-[10px] font-bold uppercase tracking-widest">Version 2.4.1</p>
      </div>
    </div>
  );
};

export default MyMadaniLaunchScreen;