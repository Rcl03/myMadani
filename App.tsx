
import React, { useState, useMemo } from 'react';
import { Tab, SubsidyProgram, Language, Doc } from './types';
import { SUBSIDY_PROGRAMS, STRINGS, MOCK_USER_PROFILE } from './constants';
import LoginScreen from './components/Auth/LoginScreen';
import BiometricVerifier from './components/Auth/BiometricVerifier';
import DigitalIDConsentScreen from './components/Auth/DigitalIDConsentScreen';
import DigitalIDRedirectScreen from './components/Auth/DigitalIDRedirectScreen';
import DigitalIDSendConsentScreen from './components/Auth/DigitalIDSendConsentScreen';
import MyMadaniLaunchScreen from './components/Auth/MyMadaniLaunchScreen';
import AuthSuccessModal from './components/Auth/AuthSuccessModal';
import BottomNavigation from './components/Layout/BottomNavigation';
import SubsidyCard from './components/Tabs/Home/SubsidyCard';
import WalletDetailView from './components/Tabs/Home/WalletDetailView';
import AIChatbot from './components/Tabs/Chat/AIChatbot';
import NotificationCenter from './components/Tabs/Notifications/NotificationCenter';
import DigitalIDWallet from './components/Tabs/Personal/DigitalIDWallet';
import { VoiceOverMock } from './components/Accessibility/VoiceOverMock';
import { Globe, Search, Filter, CheckCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Added 'return_to_app' to the auth flow type
  const [authStep, setAuthStep] = useState<'login' | 'digital_id_consent' | 'redirecting_to_digital_id' | 'digital_id_send_consent' | 'biometric' | 'auth_success' | 'return_to_app' | 'authenticated'>('login');
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [selectedProgram, setSelectedProgram] = useState<SubsidyProgram | null>(null);
  const [walletAction, setWalletAction] = useState<'view' | 'payment'>('view');
  const [lang, setLang] = useState<Language>('ms');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Shared Document State (Lifted from DigitalIDWallet)
  const [docs, setDocs] = useState<Doc[]>([
     { 
       id: '1', 
       name: 'MyKad_Copy_Front.jpg', 
       date: '12 Jan 2024', 
       size: '2.4 MB', 
       type: 'img',
       fileUrl: 'https://placehold.co/600x400/003366/FFF?text=MyKad+Front+Copy' 
     },
     { 
       id: '2', 
       name: 'Driving_License.pdf', 
       date: '15 Mar 2024', 
       size: '1.1 MB', 
       type: 'pdf',
       fileUrl: 'https://placehold.co/600x800/CC0000/FFF?text=Driving+License+PDF+Preview' 
     },
     { 
       id: '3', 
       name: 'Salary_Slip_Jan2024.pdf', 
       date: '30 Jan 2024', 
       size: '0.8 MB', 
       type: 'pdf',
       fileUrl: 'https://placehold.co/600x800/FFA500/FFF?text=Salary+Slip+Confidential' 
     },
  ]);

  const handleLogin = () => {
    setAuthStep('digital_id_consent');
  };

  const handleConsentConfirmed = () => {
    // Show splash screen "app launch" effect
    setAuthStep('redirecting_to_digital_id');
  };

  const handleRedirectComplete = () => {
    // Proceed to the send consent confirmation
    setAuthStep('digital_id_send_consent');
  };

  const handleSendConsentConfirmed = () => {
    // Proceed to biometrics
    setAuthStep('biometric');
  };

  const handleSendConsentCancelled = () => {
    // Go back to start if they say No
    setAuthStep('login');
  };

  const handleBiometricSuccess = () => {
    // Show the Success Modal instead of going straight to home
    setAuthStep('auth_success');
  };

  const handleAuthSuccessDismiss = () => {
    // Show the "Return to App" splash screen
    setAuthStep('return_to_app');
  };

  const handleAppReturnComplete = () => {
    // Final step: User is authenticated and lands on Home
    setAuthStep('authenticated');
  };
  
  const handleOpenProgram = (programId: string, action: 'view' | 'payment' = 'view') => {
    const program = SUBSIDY_PROGRAMS.find(p => p.id === programId);
    if (program) {
      setSelectedProgram(program);
      setWalletAction(action);
    }
  };

  const t = STRINGS[lang];

  // --- Derived State for Home Dashboard ---
  const totalBalance = useMemo(() => {
    return SUBSIDY_PROGRAMS.reduce((sum, p) => (p.quotaUnit === 'RM' || p.quotaUnit === null) ? sum + p.currentBalance : sum, 0);
  }, []);

  const activeSubsidiesCount = useMemo(() => {
    return SUBSIDY_PROGRAMS.filter(p => p.eligibilityStatus === 'eligible' || p.applicationStatus === 'approved').length;
  }, []);

  const pendingCount = useMemo(() => {
    return SUBSIDY_PROGRAMS.filter(p => p.eligibilityStatus === 'pending').length;
  }, []);

  const actionNeededCount = useMemo(() => {
    return SUBSIDY_PROGRAMS.filter(p => p.alertMessage || p.applicationStatus === 'documents_required').length;
  }, []);

  const categories = ['All', 'Groceries', 'Fuel', 'Medical', 'Elderly', 'Children', 'Selangor'];

  const filteredPrograms = useMemo(() => {
    return SUBSIDY_PROGRAMS.filter(p => {
      const matchesSearch = p.programName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.programDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // --- Render Functions ---

  const renderHome = () => (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* 1. Dashboard Header - Deep Midnight Gradient */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-slate-900 pt-14 pb-8 px-6 rounded-b-[2.5rem] shadow-2xl overflow-hidden z-20">
        {/* Subtle Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        {/* User Info Row */}
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.welcome_back}</p>
            <h1 className="text-white text-3xl font-bold tracking-tight">{MOCK_USER_PROFILE.name}</h1>
          </div>
        </div>

        {/* Main Balance Card - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 mb-8 relative z-10 shadow-lg">
          <div className="flex justify-between items-center mb-1">
             <div className="flex items-center gap-2">
               <Sparkles size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" />
               <span className="text-gray-300 text-xs font-semibold uppercase tracking-wide">{t.total_subsidies}</span>
             </div>
             <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center">
               <CheckCircle size={10} className="mr-1" /> {t.verified_id}
             </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-white/60 text-lg font-medium">RM</span>
            <span className="text-white text-5xl font-bold tracking-tighter">
              {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Stats Row - Clean Glass Dividers */}
        <div className="grid grid-cols-3 gap-0 relative z-10 text-center divide-x divide-white/10">
          <div className="px-2">
            <p className="text-white font-bold text-xl">{activeSubsidiesCount}</p>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1">{t.active}</p>
          </div>
          <div className="px-2">
            <p className="text-white font-bold text-xl">{pendingCount}</p>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1">{t.pending}</p>
          </div>
          <div className="px-2">
            <p className="text-white font-bold text-xl">{actionNeededCount}</p>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1">{t.action_needed}</p>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Section */}
      <div className="px-5 -mt-6 relative z-30">
        {/* iOS Style Search Bar */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 mb-6 flex items-center">
           <div className="flex-1 h-11 bg-gray-100 rounded-xl flex items-center px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="text-gray-400 mr-3" size={18} />
              <input 
                type="text" 
                placeholder={t.search_placeholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 placeholder-gray-400 h-full p-0"
              />
           </div>
           <button className="ml-2 w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Filter size={20} />
           </button>
        </div>

        {/* Filter Chips - High Contrast Pill Style */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-8 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 min-w-fit px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 shadow-sm ${
                selectedCategory === cat 
                ? 'bg-black text-white scale-105 shadow-md' 
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. Subsidy List */}
        <div className="grid grid-cols-1 gap-1">
          {filteredPrograms.map((program) => (
            <SubsidyCard 
              key={program.id} 
              program={program} 
              onClick={() => setSelectedProgram(program)}
            />
          ))}
          {filteredPrograms.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">{t.no_subsidies}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case Tab.HOME: return renderHome();
      case Tab.CHAT: return <AIChatbot lang={lang} onOpenProgram={handleOpenProgram} />;
      case Tab.NOTIFICATIONS: return <NotificationCenter lang={lang} />;
      case Tab.PERSONAL: return <DigitalIDWallet lang={lang} docs={docs} onUpdateDocs={setDocs} />;
      default: return renderHome();
    }
  };

  if (authStep === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // New Consent Step
  if (authStep === 'digital_id_consent') {
    return <DigitalIDConsentScreen onConfirm={handleConsentConfirmed} />;
  }

  // New Redirect/Splash Step
  if (authStep === 'redirecting_to_digital_id') {
    return <DigitalIDRedirectScreen onComplete={handleRedirectComplete} />;
  }

  // New Send Consent Confirmation Step
  if (authStep === 'digital_id_send_consent') {
    return <DigitalIDSendConsentScreen onConfirm={handleSendConsentConfirmed} onCancel={handleSendConsentCancelled} />;
  }

  if (authStep === 'biometric') {
    return <BiometricVerifier onVerifyComplete={handleBiometricSuccess} />;
  }

  // New Success Modal Step
  if (authStep === 'auth_success') {
    return <AuthSuccessModal onDismiss={handleAuthSuccessDismiss} />;
  }

  // New Return Launch Screen
  if (authStep === 'return_to_app') {
    return <MyMadaniLaunchScreen onComplete={handleAppReturnComplete} />;
  }

  // Use h-screen for the wrapper to constrain flex containers
  const isChat = currentTab === Tab.CHAT;
  const isHome = currentTab === Tab.HOME;

  return (
    <div className="h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Accessibility Mock Controller */}
      <VoiceOverMock />

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setShowLangMenu(!showLangMenu)}
          className={`backdrop-blur-md p-2 rounded-full shadow-sm border transition-colors ${isHome ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
        >
          <Globe size={20} />
        </button>
        {showLangMenu && (
          <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-32 animate-fade-in-up origin-top-right overflow-hidden">
             {[
               { code: 'ms', label: 'Bahasa' },
               { code: 'en', label: 'English' },
               { code: 'zh', label: '中文' },
               { code: 'ta', label: 'தமிழ்' }
             ].map((l) => (
               <button 
                 key={l.code}
                 onClick={() => { setLang(l.code as Language); setShowLangMenu(false); }}
                 className={`block w-full text-left px-4 py-3 text-sm transition-colors ${lang === l.code ? 'bg-gray-50 font-bold text-black' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 {l.label}
               </button>
             ))}
          </div>
        )}
      </div>

      {/* Detail Overlay */}
      {selectedProgram && (
        <WalletDetailView 
          key={selectedProgram.id} // Ensures fresh mount on change
          program={selectedProgram} 
          onClose={() => setSelectedProgram(null)}
          lang={lang}
          initialAction={walletAction}
          savedDocs={docs} // Pass docs here
        />
      )}

      {/* Main Content Area */}
      {/* Use flex-1 to fill remaining height. overflow-hidden prevents body scroll for chat. */}
      <main className={`flex-1 bg-gray-50 w-full ${isChat ? 'overflow-hidden flex flex-col' : 'overflow-y-auto no-scrollbar'}`}>
        {renderContent()}
      </main>

      {/* Navigation */}
      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
