import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanFace, X } from 'lucide-react';

interface BiometricVerifierProps {
  onVerifyComplete: () => void;
  isPayment?: boolean;
  onClose?: () => void;
}

const BiometricVerifier: React.FC<BiometricVerifierProps> = ({ onVerifyComplete, isPayment = false, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [statusText, setStatusText] = useState("Initializing Camera...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setStatusText("Requesting camera access...");
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // Front-facing camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        streamRef.current = stream;

        // Set the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatusText("Align your face within the circle");
          
          // Wait for video to be ready, then start scanning
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              // Auto-start scanning after a brief delay
              setTimeout(() => {
                setScanning(true);
                setStatusText("Verifying Identity...");
                
                // Mock verification success after scanning
                setTimeout(() => {
                  onVerifyComplete();
                }, 2500);
              }, 1000);
            };
          }
        }
      } catch (err: any) {
        console.error('Camera access error:', err);
        setError(err.message || 'Failed to access camera');
        setStatusText("Camera access denied. Please allow camera permissions.");
        
        // Fallback: complete after showing error (for demo purposes)
        setTimeout(() => {
          onVerifyComplete();
        }, 3000);
      }
    };

    startCamera();

    // Cleanup: stop camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onVerifyComplete]);

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
      
      {error && (
        <p className="mt-4 text-sm text-yellow-300 text-center max-w-xs">
          {error}
        </p>
      )}
      
      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-300" aria-hidden="true">
        <Camera size={16} />
        <span>MyDigital ID Secure Environment</span>
      </div>
    </div>
  );
};

export default BiometricVerifier;