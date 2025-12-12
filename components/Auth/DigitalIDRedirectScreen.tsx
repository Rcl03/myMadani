import React, { useEffect, useState } from 'react';

interface DigitalIDRedirectScreenProps {
  onComplete: () => void;
}

const DigitalIDRedirectScreen: React.FC<DigitalIDRedirectScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 100);

    // Complete the redirect after a few seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // This is the SVG logo encoded as a Data URI.
  // To use your own file, replace this string with your file path, e.g., "/assets/mydigitalid.png"
  const logoSrc = "data:image/svg+xml,%3Csvg viewBox='0 0 350 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='230' y1='65' x2='250' y2='15' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2300AEEF'/%3E%3Cstop offset='1' stop-color='%230077CC'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='10' y='55' font-size='56' font-weight='800' font-family='sans-serif' fill='%23D91F26' letter-spacing='-3'%3Emy%3C/text%3E%3Ctext x='85' y='55' font-size='56' font-weight='800' font-family='sans-serif' fill='%23001F5B' letter-spacing='-3'%3Edigital%3C/text%3E%3Cline x1='245' y1='65' x2='265' y2='15' stroke='url(%23grad)' stroke-width='5' stroke-linecap='square' /%3E%3Ctext x='270' y='55' font-size='56' font-weight='800' font-family='sans-serif' fill='%2300AEEF' letter-spacing='-1'%3EID%3C/text%3E%3C/svg%3E";

  return (
    <div className="h-screen w-full bg-white relative flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Abstract Background Shapes - Clean White/Grey theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[800px] bg-blue-50 rounded-[100%] rotate-45 mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      {/* Main Content Container with App Open Animation */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
      >
         {/* MyDigital ID Logo Image */}
         <div className="w-72 sm:w-80">
            <img 
              src={logoSrc} 
              alt="MyDigital ID Logo" 
              className="w-full h-auto drop-shadow-sm object-contain"
            />
         </div>
      </div>

      {/* Loading Spinner */}
      <div className={`absolute bottom-24 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
         <div className="w-8 h-8 border-4 border-gray-100 border-t-[#001F5B] rounded-full animate-spin"></div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center z-10">
         <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">Secured Identity Platform</p>
      </div>
    </div>
  );
};

export default DigitalIDRedirectScreen;