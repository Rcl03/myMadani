import React from 'react';
import { Home, MessageSquareText, Bell, User } from 'lucide-react';
import { Tab } from '../../types';

interface BottomNavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onTabChange }) => {
  const getTabColor = (tab: Tab) => currentTab === tab ? 'text-gray-900 scale-110 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600';

  const handleKeyDown = (e: React.KeyboardEvent, tab: Tab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tab);
    }
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40" 
      aria-label="Main Navigation"
    >
       {/* Glass Container */}
       <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-t border-white/40 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]"></div>
       
       <div className="relative z-10 pb-safe pt-2 px-6 h-20" role="tablist" aria-label="App Sections">
        <div className="flex justify-around items-center h-full pb-2">
          <button 
            role="tab"
            aria-selected={currentTab === Tab.HOME}
            aria-label="Home Dashboard"
            onClick={() => onTabChange(Tab.HOME)}
            onKeyDown={(e) => handleKeyDown(e, Tab.HOME)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${getTabColor(Tab.HOME)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-1`}
          >
            <Home size={24} strokeWidth={currentTab === Tab.HOME ? 2.5 : 2} aria-hidden="true" />
            <span className="sr-only">Home</span>
            {currentTab === Tab.HOME && <div className="w-1 h-1 bg-gray-900 rounded-full mt-1" aria-hidden="true"></div>}
          </button>
          
          <button 
            role="tab"
            aria-selected={currentTab === Tab.CHAT}
            aria-label="AI Assistant Chat"
            onClick={() => onTabChange(Tab.CHAT)}
            onKeyDown={(e) => handleKeyDown(e, Tab.CHAT)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${getTabColor(Tab.CHAT)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-1`}
          >
            <div className="relative">
              <MessageSquareText size={24} strokeWidth={currentTab === Tab.CHAT ? 2.5 : 2} aria-hidden="true" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white/80 shadow-sm" role="status" aria-label="New messages available"></span>
            </div>
            <span className="sr-only">AI Chat</span>
            {currentTab === Tab.CHAT && <div className="w-1 h-1 bg-gray-900 rounded-full mt-1" aria-hidden="true"></div>}
          </button>

          <button 
            role="tab"
            aria-selected={currentTab === Tab.NOTIFICATIONS}
            aria-label="Notifications"
            onClick={() => onTabChange(Tab.NOTIFICATIONS)}
            onKeyDown={(e) => handleKeyDown(e, Tab.NOTIFICATIONS)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${getTabColor(Tab.NOTIFICATIONS)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-1`}
          >
            <div className="relative">
              <Bell size={24} strokeWidth={currentTab === Tab.NOTIFICATIONS ? 2.5 : 2} aria-hidden="true" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white/80 shadow-sm" role="status" aria-label="New notifications available"></span>
            </div>
            <span className="sr-only">Notifications</span>
            {currentTab === Tab.NOTIFICATIONS && <div className="w-1 h-1 bg-gray-900 rounded-full mt-1" aria-hidden="true"></div>}
          </button>

          <button 
            role="tab"
            aria-selected={currentTab === Tab.PERSONAL}
            aria-label="Personal Profile and Wallet"
            onClick={() => onTabChange(Tab.PERSONAL)}
            onKeyDown={(e) => handleKeyDown(e, Tab.PERSONAL)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${getTabColor(Tab.PERSONAL)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-1`}
          >
            <User size={24} strokeWidth={currentTab === Tab.PERSONAL ? 2.5 : 2} aria-hidden="true" />
            <span className="sr-only">Profile</span>
            {currentTab === Tab.PERSONAL && <div className="w-1 h-1 bg-gray-900 rounded-full mt-1" aria-hidden="true"></div>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;