import React from 'react';
import { Shield } from 'lucide-react';
import { getImagePath } from '../../utils/imagePath';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10 text-center">
        <div className="flex flex-col items-center animate-fade-in">
           <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl mb-6 overflow-hidden">
             <img src={getImagePath('/applogo.png')} alt="MyMadani Logo" className="w-full h-full object-contain" />
           </div>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
             MyMadani
           </h1>
           <p className="text-gray-500 mt-2 text-sm">
             Your Gateway to Government Services
           </p>
        </div>

        <div className="space-y-4 pt-8 animate-slide-up">
          <button 
            onClick={onLogin}
            className="w-full bg-madani-blue hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center space-x-3"
          >
            <Shield size={20} />
            <span>Login with MyDigital ID</span>
          </button>
          
          <button className="w-full bg-white text-gray-600 font-medium py-4 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            More Options
          </button>
        </div>

        <p className="text-xs text-gray-400 pt-8">
          Secured by Malaysian Government Digital Infrastructure
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
