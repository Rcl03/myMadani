import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanFace, X } from 'lucide-react';

interface BiometricVerifierProps {
  onVerifyComplete: () => void;
  isPayment?: boolean;
  onClose?: () => void;
}

const BiometricVerifier: React.FC<BiometricVerifierProps> = ({ onVerifyComplete, isPayment = false, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [statusText, setStatusText] = useState("Initializing Camera...");
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  useEffect(() => {
    // Randomly select between authenticate1.mp4 and authenticate2.mp4
    const videos = ['/authenticate1.mp4', '/authenticate2.mp4'];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  useEffect(() => {
    if (!selectedVideo || !videoRef.current) return;

    const startVideo = () => {
      if (videoRef.current) {
        videoRef.current.src = selectedVideo;
        videoRef.current.load();
        
        const handleCanPlay = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
            setStatusText("Align your face within the circle");
            
            // Auto-start scanning after a brief delay
            setTimeout(() => {
              setScanning(true);
              setStatusText("Verifying Identity...");
              // Mock verification success
              setTimeout(() => {
                onVerifyComplete();
              }, 2500);
            }, 1000);
          }
        };

        videoRef.current.addEventListener('canplay', handleCanPlay, { once: true });
        
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('canplay', handleCanPlay);
          }
        };
      }
    };

    startVideo();
  }, [selectedVideo, onVerifyComplete]);

  return (
    <div 
      className="fixed inset-0 bg-madani-blue z-50 flex flex-col items-center justify-center text-white"
      role="dialog"
      aria-label={isPayment ? 'Payment Authorization' : 'Identity Verification'}
      aria-modal="true"
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-50"
          aria-label="Close Verification"
        >
          <X size={24} className="text-white" />
        </button>
      )}

      <h2 className="text-xl font-bold mb-8">
        {isPayment ? 'Authorize Payment' : 'Identity Verification'}
      </h2>
      
      <div className="relative w-64 h-64 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl" aria-hidden="true">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          muted
          loop
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Overlay */}
        {scanning && (
          <div className="absolute inset-0 bg-green-500/10 animate-pulse">
            <div className="w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-scan-line absolute top-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanFace className="w-20 h-20 text-white/50 animate-ping" />
            </div>
          </div>
        )}
      </div>

      <p 
        className="mt-8 text-lg font-medium animate-pulse"
        role="alert"
        aria-live="assertive"
      >
        {statusText}
      </p>
      
      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-300" aria-hidden="true">
        <Camera size={16} />
        <span>MyDigital ID Secure Environment</span>
      </div>
    </div>
  );
};

export default BiometricVerifier;