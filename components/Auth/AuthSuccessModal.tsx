import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface AuthSuccessModalProps {
  onDismiss: () => void;
}

const AuthSuccessModal: React.FC<AuthSuccessModalProps> = ({ onDismiss }) => {
  // Countdown to auto-dismiss, mimicking the "(1)" in the design
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onDismiss();
    }
  }, [count, onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 font-sans animate-fade-in">
      <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-[2rem] p-8 text-center shadow-2xl flex flex-col items-center animate-slide-up border border-gray-100">
        
        {/* Header Title */}
        <h2 className="text-[#001F5B] text-2xl font-bold mb-8 tracking-tight">Congratulations</h2>
        
        {/* Iconography */}
        <div className="mb-8 relative flex items-center justify-center">
           {/* Decorative rings */}
           <div className="absolute w-24 h-24 bg-[#E0F7FA] rounded-full animate-ping opacity-20"></div>
           <div className="absolute w-20 h-20 bg-[#E0F7FA] rounded-full"></div>
           
           {/* Main Icon */}
           <div className="relative z-10 bg-white rounded-full p-1">
             <CheckCircle size={72} className="text-[#00AEEF] fill-white" />
           </div>
        </div>

        {/* Message Text */}
        <div className="space-y-3 mb-10 px-2">
           <p className="text-gray-600 font-medium text-sm leading-relaxed">
             Your Digital ID has been successfully submitted.
           </p>
           <p className="text-[#00AEEF] font-bold text-sm leading-relaxed">
             Please return to your web browser to continue.
           </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onDismiss}
          className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white font-bold py-4 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 text-base tracking-wide"
        >
          OK ({count})
        </button>
      </div>
    </div>
  );
};

export default AuthSuccessModal;