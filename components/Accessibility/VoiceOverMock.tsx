import React, { useState, useEffect, useRef } from 'react';
import { Accessibility } from 'lucide-react';

export const VoiceOverMock: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const isSimulatingRef = useRef(false);

  useEffect(() => {
    // Clean up when disabled
    if (!enabled) {
      setHighlightRect(null);
      activeElementRef.current = null;
      window.speechSynthesis.cancel();
      return;
    }

    const speak = (text: string) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to pick a decent voice if available, otherwise default
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    };

    const handleClick = (e: MouseEvent) => {
      // 1. If we triggered this programmatically (the "double tap"), let it pass through.
      if (isSimulatingRef.current) {
        isSimulatingRef.current = false;
        return;
      }

      const target = e.target as HTMLElement;

      // 2. Ignore clicks on the toggle button itself so we can always turn it off
      if (target.closest('#vo-toggle')) return;

      // 3. Intercept all other clicks
      e.preventDefault();
      e.stopPropagation();

      // 4. Find the closest meaningful element (interactive or text container)
      //    We traverse up looking for semantic roles or text content
      const interactive = target.closest(
        'button, a, input, [role="button"], [aria-label], h1, h2, h3, h4, p, li, [role="tab"], .group'
      ) as HTMLElement;
      
      if (!interactive) return;

      const now = Date.now();
      const isDoubleTap = activeElementRef.current === interactive && (now - lastClickTimeRef.current < 500);

      if (isDoubleTap) {
        // --- ACTION: ACTIVATE ---
        // User double-clicked the selected item. Dispatch a real click.
        isSimulatingRef.current = true;
        interactive.click();
        
        // Also ensure focus for inputs
        if (interactive.tagName === 'INPUT' || interactive.tagName === 'TEXTAREA') {
          interactive.focus();
        }
        
        lastClickTimeRef.current = 0; // Reset
        setHighlightRect(null); // Optional: clear highlight on action
      } else {
        // --- ACTION: SELECT & SPEAK ---
        activeElementRef.current = interactive;
        lastClickTimeRef.current = now;
        
        // Draw the border
        setHighlightRect(interactive.getBoundingClientRect());

        // Construct Speech Text
        // Priority: aria-label -> alt text -> innerText
        let text = interactive.getAttribute('aria-label') || interactive.getAttribute('alt') || interactive.innerText || "";
        
        // Determine "Role" hint (e.g., "Button", "Link")
        const role = interactive.getAttribute('role') || interactive.tagName.toLowerCase();
        let hint = "";
        
        if (role === 'button' || interactive.tagName === 'BUTTON' || interactive.classList.contains('cursor-pointer')) {
            hint = "Button";
        } else if (role === 'link' || interactive.tagName === 'A') {
            hint = "Link";
        } else if (interactive.tagName === 'INPUT') {
            hint = "Text Field, Double tap to edit";
        } else if (role === 'img' || interactive.tagName === 'IMG') {
            hint = "Image";
        } else if (role === 'heading' || /^h[1-6]$/.test(interactive.tagName.toLowerCase())) {
            hint = "Heading";
        }

        // Speak
        if (text.trim()) {
           // Limit text length to avoid reading huge blocks
           const cleanText = text.replace(/\n/g, ' ').substring(0, 150);
           speak(`${cleanText}. ${hint}`);
        } else {
           speak(hint || "Element");
        }
      }
    };

    // Update highlight position on scroll
    const handleScroll = () => {
        if (activeElementRef.current) {
            setHighlightRect(activeElementRef.current.getBoundingClientRect());
        }
    };

    // Use Capture phase to ensure we intercept before React or other listeners
    window.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    
    return () => {
        window.removeEventListener('click', handleClick, { capture: true });
        window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [enabled]);

  return (
    <>
      <button
        id="vo-toggle"
        onClick={() => setEnabled(!enabled)}
        className={`fixed bottom-24 left-4 z-[100] p-2.5 rounded-full shadow-xl border-2 transition-all duration-300 ${enabled ? 'bg-gray-900 text-white border-white scale-110' : 'bg-white/80 backdrop-blur text-gray-900 border-gray-200 hover:scale-105'}`}
        aria-label={enabled ? "Turn VoiceOver Simulation Off" : "Turn VoiceOver Simulation On"}
      >
        <Accessibility size={20} />
      </button>

      {/* VoiceOver Cursor (Black Box) */}
      {enabled && highlightRect && (
        <div 
            className="fixed z-[9999] pointer-events-none transition-all duration-100 ease-out"
            style={{
                top: highlightRect.top - 4,
                left: highlightRect.left - 4,
                width: highlightRect.width + 8,
                height: highlightRect.height + 8,
                border: '4px solid black',
                borderRadius: '8px',
                boxShadow: '0 0 0 2px white' // Double border effect like iOS
            }}
        />
      )}
      
      {/* Simulation Info Banner */}
      {enabled && (
          <div className="fixed top-16 left-4 z-[100] bg-black/90 text-white text-[10px] px-3 py-2 rounded-xl pointer-events-none backdrop-blur-md shadow-lg border border-white/20 animate-fade-in">
              <p className="font-bold mb-0.5">VoiceOver Mode ON</p>
              <p className="opacity-80">• Single-click to select</p>
              <p className="opacity-80">• Double-click to activate</p>
          </div>
      )}
    </>
  );
};