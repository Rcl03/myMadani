import React from 'react';
import { ChevronLeft, Menu } from 'lucide-react';

interface DigitalIDSendConsentScreenProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

const DigitalIDSendConsentScreen: React.FC<DigitalIDSendConsentScreenProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="h-screen w-full bg-[#F5F5F5] relative flex flex-col font-sans overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Large soft rounded shape top-left */}
        <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-[#EAEAEA] rounded-[40%] rotate-12 blur-3xl opacity-60"></div>
        {/* Circular motif bottom-right */}
        <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[400px] bg-[#EAEAEA] rounded-full blur-3xl opacity-60"></div>
        {/* Small floating element */}
        <div className="absolute top-1/4 right-0 w-32 h-32 bg-[#EAEAEA] rounded-full blur-2xl opacity-40"></div>
      </div>

      {/* Top Header */}
      <div className="relative z-10 px-6 pt-6 pb-2">
        <button 
          className="flex items-center text-gray-500 font-bold text-sm hover:text-gray-700 transition-colors" 
          onClick={onCancel}
        >
            <ChevronLeft size={20} className="mr-1" />
            MyGOV
        </button>
      </div>

      {/* Menu Icon */}
      <div className="relative z-10 px-6 mt-4">
         <button className="p-2 -ml-2 text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors">
            <Menu size={28} />
         </button>
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
         <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 text-center animate-slide-up">
            <h2 className="text-[#001F5B] text-2xl font-bold mb-1 tracking-tight">Send Your Digital ID</h2>
            <p className="text-gray-400 font-medium text-sm mb-8 tracking-wide">MyDigital ID</p>
            
            <div className="mb-12 px-2">
               <p className="text-gray-800 text-lg font-medium leading-relaxed">
                 Do you agree to send your Digital ID to <span className="text-[#E91E63] font-semibold break-all">sso.digital-id.my</span>?
               </p>
            </div>

            <div className="space-y-3">
               <button 
                 onClick={onConfirm}
                 className="w-full bg-[#0056D2] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 hover:bg-blue-700 active:scale-95 transition-all text-base tracking-wide"
               >
                 Yes
               </button>
               <button 
                 onClick={onCancel}
                 className="w-full bg-white text-gray-500 border-2 border-gray-100 font-bold py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-base tracking-wide"
               >
                 No
               </button>
            </div>
         </div>
      </div>
      
      {/* Bottom padding for visual balance */}
      <div className="h-12"></div>
    </div>
  );
};

export default DigitalIDSendConsentScreen;