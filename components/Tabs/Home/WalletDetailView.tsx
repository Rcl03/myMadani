
import React, { useState, useEffect } from 'react';
import { SubsidyProgram, Doc } from '../../../types';
import { MOCK_USER_PROFILE, STRINGS } from '../../../constants';
import { X, QrCode, MapPin, ShoppingCart, Fuel, Edit3, UploadCloud, CheckCircle, Navigation, Wallet, CreditCard, AlertTriangle, Car, FileText, Lock, Stethoscope, Barcode, ChevronDown, Zap, Calendar, Clock, TrendingUp, ListChecks, RefreshCw, AlertCircle, HelpCircle, FileBarChart, ExternalLink, ChevronLeft, Image as ImageIcon, Check } from 'lucide-react';
import BiometricVerifier from '../../Auth/BiometricVerifier';

interface WalletDetailViewProps {
  program: SubsidyProgram;
  onClose: () => void;
  lang: 'ms' | 'en' | 'zh' | 'ta';
  initialAction?: 'view' | 'payment';
  savedDocs: Doc[];
}

// Revert to 4 tabs logic
type TabType = 'overview' | 'wallet' | 'info' | 'apply';
type FuelStep = 'idle' | 'input' | 'processing' | 'success';

const WalletDetailView: React.FC<WalletDetailViewProps> = ({ program, onClose, lang, initialAction = 'view', savedDocs }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  // Initialize payment view if action is 'payment'
  const [showPayment, setShowPayment] = useState(initialAction === 'payment');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'barcode'>('qr');
  const [authorized, setAuthorized] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [expandedInfoItem, setExpandedInfoItem] = useState<string | null>(null);
  
  // Apply Tab State
  const [showDocSelector, setShowDocSelector] = useState(false);
  const [attachedDoc, setAttachedDoc] = useState<Doc | null>(null);

  // Fuel Specific State
  const [fuelStep, setFuelStep] = useState<FuelStep>('idle');
  const [pumpNo, setPumpNo] = useState('');
  const [selectedStation, setSelectedStation] = useState('Petronas Jalan Tun Razak (Nearest)');
  
  // Payment View State
  const [timeLeft, setTimeLeft] = useState(120);

  const t = STRINGS[lang];

  // Sync showPayment if initialAction prop changes (e.g. re-opening from Chat)
  useEffect(() => {
    if (initialAction === 'payment') {
      setShowPayment(true);
    } else {
      setShowPayment(false);
    }
  }, [initialAction]);

  // Timer for QR/Barcode Expiry
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPayment && authorized && program.category !== 'fuel') {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showPayment, authorized, program.category]);

  const handleClosePayment = () => {
    setShowPayment(false);
    setAuthorized(false);
    setFuelStep('idle');
    setTimeLeft(120);
    // If it was initial action, maybe close the whole modal? 
    // For now, return to wallet details
  };

  // Logic to determine what happens when "Pay" is clicked
  const handlePayClick = (method: 'qr' | 'barcode' = 'qr') => {
    setPaymentMethod(method);
    if (program.category === 'fuel') {
      setFuelStep('input'); // Open Fuel Input Modal directly
    } else {
      setShowPayment(true); // Go straight to biometric for normal QR/Barcode
    }
  };

  const handleAuthorized = () => {
    setAuthorized(true);
  };

  const handleFuelAuthorize = () => {
     // Close input, open biometric
     setFuelStep('processing');
     setShowPayment(true);
  };

  const handleFormSubmit = () => {
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
    }, 1500);
  };

  const toggleInfoItem = (item: string) => {
    setExpandedInfoItem(expandedInfoItem === item ? null : item);
  };

  const openGoogleMaps = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`, '_blank');
  };

  const handleSelectDoc = (doc: Doc) => {
    setAttachedDoc(doc);
    setShowDocSelector(false);
  };

  const getMapQuery = () => {
     if (program.category === 'fuel') return 'Petrol Station near me';
     if (program.category === 'medical') return 'Klinik Panel Madani near me';
     // Default for groceries/SARA/STR
     return 'Lotus near me';
  };

  // Comprehensive Merchant Logos - Using local images from public folder
  const merchantLogos = [
     { name: "Mydin", logo: "/mydin.jpg" },
     { name: "99 Speedmart", logo: "/99speedmart.png" },
     { name: "Econsave", logo: "/econsave.jpg" },
     { name: "Lotus's", logo: "/lotus.png" },
     { name: "Giant", logo: "/Giant.svg" },
     { name: "AEON Big", logo: "/Aeon BIg.png" },
     { name: "KK Mart", logo: "/kkmart.png.webp" },
     { name: "Shell", logo: "/shell.jpeg" },
     { name: "Petronas", logo: "/petronas.jpeg" },
     { name: "Klinik Komuniti", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/1200px-Coat_of_arms_of_Malaysia.svg.png" },
     { name: "Klinik Primer", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/1200px-Coat_of_arms_of_Malaysia.svg.png" },
  ];

  const groceryStores = merchantLogos.filter(m => !['Shell', 'Petronas', 'Klinik Komuniti', 'Klinik Primer'].includes(m.name));

  // --- OVERLAYS: FUEL INPUT, BIOMETRIC, PAYMENT SUCCESS ---

  // 1. Fuel Input Modal
  if (fuelStep === 'input') {
      return (
         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-scale-in">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">{t.authorize_pump}</h3>
                  <button onClick={() => setFuelStep('idle')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"><X size={20}/></button>
               </div>
               
               {/* Station Info */}
               <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                     <Fuel size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-gray-500 uppercase">Station</p>
                     <p className="font-bold text-gray-900 text-sm">{selectedStation.split('(')[0]}</p>
                  </div>
               </div>
  
               {/* Pump Input */}
               <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.pump_number}</label>
                  <input 
                    type="number" 
                    value={pumpNo}
                    onChange={(e) => setPumpNo(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-2xl font-black text-center focus:ring-2 focus:ring-madani-blue focus:border-transparent outline-none"
                    autoFocus
                  />
               </div>
  
               <button 
                 onClick={handleFuelAuthorize}
                 disabled={!pumpNo}
                 className="w-full bg-madani-blue text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
               >
                  {t.confirm_verify}
               </button>
            </div>
         </div>
      );
  }

  // 2. Biometric Verification
  if (showPayment && !authorized) {
    return (
      <BiometricVerifier 
        onVerifyComplete={handleAuthorized} 
        isPayment={true} 
        onClose={() => {
           setShowPayment(false);
           setFuelStep('idle');
        }}
      />
    );
  }

  // 3. Payment / Success View
  if (showPayment && authorized) {
     // FUEL SUCCESS VIEW
     if (program.category === 'fuel') {
        return (
           <div className="fixed inset-0 z-50 bg-green-600 flex flex-col items-center justify-center p-6 animate-fade-in text-white">
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
                  <CheckCircle size={64} className="text-green-600" />
               </div>
               <h2 className="text-3xl font-black mb-2 text-center">{t.pump_authorized}</h2>
               <p className="text-green-100 text-center mb-8 max-w-xs">{t.lift_nozzle} <span className="font-bold">{t.pump_number} {pumpNo}</span></p>
               
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-xs border border-white/20 mb-8">
                  <div className="flex justify-between mb-2">
                     <span className="text-green-100 text-sm">{t.vehicle_plate}</span>
                     <span className="font-bold">{MOCK_USER_PROFILE.vehicles[0].plate}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-green-100 text-sm">{t.limit_litres}</span>
                     <span className="font-bold">RM 50.00</span>
                  </div>
               </div>
  
               <button 
                 onClick={handleClosePayment}
                 className="bg-white text-green-700 font-bold py-4 px-12 rounded-full shadow-lg hover:bg-green-50 active:scale-95 transition-all"
               >
                  {t.done_refueling}
               </button>
           </div>
        );
     }
  
     // STANDARD QR/BARCODE VIEW
     return (
        <div className="fixed inset-0 z-50 bg-[#001F5B] flex flex-col items-center justify-center p-6 animate-fade-in text-white">
           <button 
            onClick={handleClosePayment}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
           >
            <X size={24} />
           </button>
           
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold mb-2">{paymentMethod === 'qr' ? t.scan_to_pay : t.barcode_pay}</h2>
             <p className="text-blue-200 text-sm">{paymentMethod === 'qr' ? t.show_qr : t.present_barcode}</p>
          </div>
  
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm flex flex-col items-center justify-center space-y-6">
              {paymentMethod === 'qr' ? (
                  <div className="relative">
                     <div className="absolute inset-0 border-4 border-madani-blue/10 rounded-xl"></div>
                     <QrCode size={240} className="text-black" />
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-white p-1 rounded-full shadow-lg flex items-center justify-center">
                            <span className="text-2xl">{program.icon}</span>
                        </div>
                     </div>
                  </div>
              ) : (
                  <div className="w-full flex flex-col items-center">
                      <div className="w-full h-32 bg-black/5 rounded-lg flex items-center justify-center mb-2 overflow-hidden px-4">
                         {/* Barcode Simulation */}
                         <div className="flex items-end justify-center h-20 space-x-[3px] w-full">
                            {[...Array(40)].map((_, i) => (
                               <div key={i} className={`bg-black ${i % 3 === 0 ? 'h-full' : 'h-3/4'}`} style={{ width: i % 2 === 0 ? '4px' : '2px'}}></div>
                            ))}
                         </div>
                      </div>
                      <p className="font-mono text-lg text-gray-900 tracking-[0.2em] font-bold">{MOCK_USER_PROFILE.icNumber}</p>
                  </div>
              )}
              
              <div className="w-full h-px bg-gray-100"></div>
              
              <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium animate-pulse">
                  <Clock size={16} />
                  <span>Expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
          </div>
          
          <div className="mt-8 text-center opacity-60 text-xs font-medium max-w-xs">
             <p>Security code changes automatically.</p>
             <p>Screen brightness increased for scanning.</p>
          </div>
        </div>
     );
  }

  // --- RENDER SECTIONS ---

  // SECTION A: OVERVIEW (Balance, Stats, Transactions)
  const renderOverview = () => (
    <div className="space-y-4 animate-slide-up pb-24 pt-2">
      {/* 1. Main Balance Card - Colored Style */}
      <div 
        className={`relative overflow-hidden rounded-[2rem] p-6 shadow-xl ${program.color} text-white min-h-[220px] flex flex-col justify-between`}
        role="region" 
        aria-label={`Balance Summary. ${program.quotaUnit === 'RM' || program.quotaUnit === null ? 'RM' : ''} ${program.currentBalance}`}
      >
         {/* Background Decor */}
         <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
         <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-black opacity-10 rounded-full blur-3xl pointer-events-none"></div>

         <div className="flex justify-between items-start relative z-10">
            <div>
               <p className="text-sm font-medium opacity-90 mb-1 tracking-wide">{t.wallet_balance}</p>
               <h2 className="text-5xl font-black tracking-tighter">
                 <span className="text-2xl font-bold mr-1 opacity-80">{program.quotaUnit === 'RM' || program.quotaUnit === null ? 'RM' : ''}</span>
                 {program.currentBalance.toLocaleString()}
                 {program.quotaUnit && program.quotaUnit !== 'RM' && <span className="text-2xl ml-1">{program.quotaUnit === 'litres' ? 'L' : program.quotaUnit}</span>}
               </h2>
            </div>
            {/* Glass Icon Box */}
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg" aria-hidden="true">
               {program.category === 'groceries' ? <ShoppingCart size={24} className="text-white" /> :
                program.category === 'fuel' ? <Fuel size={24} className="text-white" /> :
                program.category === 'medical' ? <Stethoscope size={24} className="text-white" /> :
                <Wallet size={24} className="text-white" />}
            </div>
         </div>

         {/* Inner Allocated Box - Glassmorphism */}
         <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{t.total_allocated}</p>
              <p className="text-lg font-bold">
                 {program.quotaUnit === 'RM' || program.quotaUnit === null ? 'RM' : ''}{program.totalAllocated.toLocaleString()}
                 {program.quotaUnit && program.quotaUnit !== 'RM' ? ` ${program.quotaUnit}` : ''}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-white/30 flex items-center justify-center">
               <div className="h-6 w-6 bg-white/90 rounded-full shadow-inner"></div>
            </div>
         </div>
      </div>

      {/* 2. Stats Grid - Clean look */}
      <div className="grid grid-cols-2 gap-4">
         {/* Monthly Credit */}
         <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center space-x-2 text-green-600 mb-3">
               <TrendingUp size={16} aria-hidden="true" /> 
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.monthly_credit}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {program.quotaUnit === 'RM' || program.quotaUnit === null ? 'RM' : ''}{program.monthlyCredit.toLocaleString()}
            </p>
         </div>

         {/* Next Credit Date */}
         <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center space-x-2 text-blue-500 mb-3">
               <Calendar size={16} aria-hidden="true" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.next_credit}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">
               {program.nextCreditDate ? (program.nextCreditDate.length > 10 ? program.nextCreditDate.split(' ')[0] : program.nextCreditDate) : t.no_schedule}
            </p>
         </div>
      </div>

      {/* 3. Expiry Card */}
      {program.expiryDate && (
        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center space-x-4">
           <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Clock size={24} aria-hidden="true" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.balance_expires}</p>
              <p className="text-lg font-bold text-gray-900">{program.expiryDate}</p>
           </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="pt-2">
         <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-gray-900 text-lg flex items-center">
               <FileBarChart size={20} className="mr-2 text-gray-400" aria-hidden="true" />
               {t.transactions}
            </h3>
            <button className="text-madani-blue text-xs font-bold bg-blue-50 px-3 py-1 rounded-full">{t.see_all}</button>
         </div>
         <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden" role="list">
            {program.transactions && program.transactions.length > 0 ? (
               program.transactions.map((tx) => {
                  // Find logo based on merchant name if available
                  const merchantData = tx.merchant 
                      ? merchantLogos.find(m => tx.merchant!.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(tx.merchant!.toLowerCase())) 
                      : null;

                  return (
                     <div key={tx.id} role="listitem" className="flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 ${merchantData ? 'bg-white p-2' : (tx.type === 'debit' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500')}`}>
                              {merchantData ? (
                                 <img src={merchantData.logo} alt={merchantData.name} className="w-full h-full object-contain" />
                              ) : (
                                 tx.type === 'debit' ? <Wallet size={20} /> : <CreditCard size={20} />
                              )}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 text-sm">{tx.description}</p>
                              <p className="text-xs text-gray-400 font-medium">{tx.date}</p>
                           </div>
                        </div>
                        <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`} aria-label={`${tx.type === 'credit' ? 'Credit' : 'Debit'} ${Math.abs(tx.amount)}`}>
                           {tx.amount > 0 ? '+' : ''}{program.quotaUnit === 'RM' || program.quotaUnit === null ? 'RM' : ''}{Math.abs(tx.amount).toFixed(2)}
                        </span>
                     </div>
                  );
               })
            ) : (
               <div className="p-8 text-center text-gray-400 text-sm">{t.no_transactions}</div>
            )}
         </div>
      </div>
    </div>
  );

  // SECTION B: INFO (Static Details)
  const renderInfo = () => (
    <div className="space-y-4 animate-slide-up pb-24 pt-2">
        {/* About Section */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900 text-lg mb-2">{t.about_program} {program.programCode}</h3>
           <p className="text-gray-600 text-sm leading-relaxed">
              {program.programDescription}
           </p>
        </div>

        {/* Benefit Amount Card */}
        {program.benefitAmount && (
          <div className="bg-[#E8F5E9] rounded-[1.5rem] p-6 border border-[#C8E6C9] flex items-center space-x-4">
             <div className="w-14 h-14 rounded-2xl bg-[#C8E6C9] flex items-center justify-center text-[#2E7D32]">
                <Wallet size={28} aria-hidden="true" />
             </div>
             <div>
                <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide opacity-80 mb-1">{t.benefit_amount}</p>
                <p className="text-xl font-black text-[#1B5E20]">
                  {program.benefitAmount}
                </p>
             </div>
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-3" role="list">
           {[
             { id: 'eligibility', label: t.eligibility_criteria, icon: <ListChecks size={20} />, color: 'bg-blue-50 text-blue-600', content: Array.isArray(program.eligibilityCriteria) ? program.eligibilityCriteria.map(c => `• ${c}`).join('\n') : program.eligibilityCriteria },
             { id: 'renewal', label: t.renewal_rules, icon: <RefreshCw size={20} />, color: 'bg-indigo-50 text-indigo-600', content: program.renewalRules },
             { id: 'conditions', label: t.conditions, icon: <FileText size={20} />, color: 'bg-orange-50 text-orange-600', content: Array.isArray(program.conditions) ? program.conditions.map(c => `• ${c}`).join('\n') : program.conditions },
             { id: 'limitations', label: t.limitations, icon: <AlertCircle size={20} />, color: 'bg-red-50 text-red-600', content: Array.isArray(program.limitations) ? program.limitations.map(c => `• ${c}`).join('\n') : program.limitations },
             { id: 'faq', label: t.faq, icon: <HelpCircle size={20} />, color: 'bg-yellow-50 text-yellow-600', content: Array.isArray(program.faq) ? program.faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') : 'No FAQs available.' },
           ].map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all">
                 <button 
                   onClick={() => toggleInfoItem(item.id)}
                   className="p-4 flex justify-between items-center cursor-pointer active:bg-gray-50 w-full text-left"
                   aria-expanded={expandedInfoItem === item.id}
                   aria-controls={`info-content-${item.id}`}
                 >
                    <div className="flex items-center space-x-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                          {item.icon}
                       </div>
                       <span className="font-bold text-gray-900">{item.label}</span>
                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedInfoItem === item.id ? 'rotate-180' : ''}`} />
                 </button>
                 {expandedInfoItem === item.id && (
                   <div id={`info-content-${item.id}`} className="px-16 pb-6 pt-0 text-sm text-gray-600 leading-relaxed animate-fade-in whitespace-pre-wrap">
                      {item.content}
                   </div>
                 )}
              </div>
           ))}
        </div>
    </div>
  );

  // SECTION C: WALLET (Usage, Payments, Maps)
  const renderWallet = () => (
    <div className="space-y-6 animate-slide-up pb-24 pt-2">
       
       {/* 1. Payment Actions Card (Restored) */}
       {(program.eligibilityStatus === 'eligible' || program.applicationStatus === 'approved') && (
         <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 shadow-xl text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full pointer-events-none"></div>
            
            <h3 className="font-bold text-white mb-6 flex items-center justify-center opacity-90">
               <Zap size={16} className="mr-2 text-yellow-400" fill="currentColor" aria-hidden="true"/> 
               {program.category === 'fuel' ? t.start_refueling : t.payment_methods}
            </h3>
            
            {/* Conditional Layout for Fuel vs Others */}
            {program.category === 'fuel' ? (
                <div className="relative z-10">
                   <button 
                     onClick={() => handlePayClick('qr')}
                     className="w-full bg-white text-gray-900 py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center active:scale-95 transition-all hover:bg-gray-100"
                     aria-label="Authorize Pump"
                   >
                      <Fuel size={24} className="mr-2 text-madani-blue" aria-hidden="true" />
                      <span>{t.authorize_pump}</span>
                   </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 relative z-10">
                   <button 
                     onClick={() => handlePayClick('qr')}
                     className="bg-white text-gray-900 py-4 rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center active:scale-95 transition-all hover:bg-gray-100"
                     aria-label="Show QR Code"
                   >
                      <QrCode size={28} className="mb-2" aria-hidden="true" />
                      <span>{t.show_qr}</span>
                   </button>
                   <button 
                     onClick={() => handlePayClick('barcode')}
                     className="bg-gray-700/50 border border-gray-600 text-white py-4 rounded-2xl font-bold flex flex-col items-center justify-center active:bg-gray-700 transition-all backdrop-blur-sm"
                     aria-label="Show Barcode"
                   >
                      <Barcode size={28} className="mb-2" aria-hidden="true" />
                      <span>{t.barcode}</span>
                   </button>
                </div>
            )}

            <p className="text-[10px] text-gray-400 mt-6 flex items-center justify-center uppercase tracking-widest font-bold">
               <Lock size={10} className="mr-1.5" aria-hidden="true" /> {t.secured_by_biometrics}
            </p>
         </div>
       )}

       {/* 2. Allowed Items List */}
       {program.allowedItems && program.allowedItems.length > 0 && (
         <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              {program.programCode === 'STR' || program.programCode === 'SARA' ? t.subsidized_products : t.eligible_items}
            </h3>
            <div className="grid grid-cols-2 gap-3">
               {program.allowedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm shrink-0" aria-hidden="true">
                        {/* Simple emoji mapping or generic icon */}
                        {item.includes('Rice') ? '🍚' : 
                         item.includes('Oil') ? '🛢️' : 
                         item.includes('Sugar') ? '🍬' : 
                         item.includes('Flour') ? '🌾' : 
                         item.includes('Egg') ? '🥚' : 
                         item.includes('Chicken') ? '🐔' : 
                         item.includes('Fish') ? '🐟' : 
                         item.includes('Veg') ? '🥬' : 
                         item.includes('Baby') ? '🍼' :
                         item.includes('Diaper') ? '👶' :
                         item.includes('School') ? '🎒' :
                         '📦'}
                     </div>
                     <span className="text-sm font-bold text-gray-700 leading-tight">{item}</span>
                  </div>
               ))}
            </div>
         </div>
       )}

       {/* 3. Specific Program Features */}
       
       {/* SARA & SMUE (State) Shopping Logic */}
       {(program.category === 'groceries' || program.category === 'selangor') && (
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-gray-900 text-lg">{program.category === 'selangor' ? 'SMUE Merchants' : 'Participating Stores'}</h3>
                {program.category === 'groceries' && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg">{t.delivery_available}</span>}
             </div>
             <button className="w-full bg-green-50 text-green-700 font-bold py-4 rounded-2xl mb-6 flex items-center justify-center hover:bg-green-100 transition-colors">
                <ShoppingCart size={18} className="mr-2" /> {t.shop_online}
             </button>
             
             {/* Partner Stores Carousel (Updated with Grocery Stores) */}
             <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{t.participating_stores}</h4>
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                   {groceryStores.map((store, i) => (
                      <div key={i} className="flex-shrink-0 flex flex-col items-center">
                         <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center p-2">
                             <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                         </div>
                         <span className="text-[10px] text-gray-600 font-bold mt-1">{store.name}</span>
                      </div>
                   ))}
                </div>
             </div>
             
             {/* Functional Google Maps Link */}
             <button
               onClick={() => openGoogleMaps(getMapQuery())}
               className="w-full h-44 bg-gray-100 rounded-2xl relative overflow-hidden mb-4 border border-gray-200 group cursor-pointer hover:shadow-md transition-all text-left"
               aria-label="Find stores on Google Maps"
             >
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Kuala_Lumpur_City_Centre_Map.png')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white/90 backdrop-blur px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 animate-bounce group-hover:scale-105 transition-transform">
                      <MapPin className="text-red-500" size={16} fill="currentColor" aria-hidden="true" />
                      <span className="text-xs font-bold text-gray-800">{t.find_maps}</span>
                      <ExternalLink size={12} className="text-gray-400 ml-1" aria-hidden="true" />
                   </div>
                </div>
             </button>
          </div>
       )}

       {/* Fuel Logic */}
       {program.category === 'fuel' && (
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-gray-900 text-lg">{t.nearest_station}</h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-lg">{t.gps_active}</span>
             </div>

             <div className="flex items-center space-x-4 mb-6 bg-gradient-to-r from-blue-50 to-white p-4 rounded-2xl border border-blue-50">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 p-2">
                   {/* Petronas Logo */}
                   <img src="/petronas.jpeg" alt="Petronas" className="w-full h-full object-contain" />
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">{t.recommended}</p>
                   <p className="font-bold text-gray-900 text-sm leading-tight">Petronas Jalan Tun Razak</p>
                   <p className="text-xs text-blue-500 mt-1 flex items-center"><Navigation size={10} className="mr-1"/> 0.8 km (3 mins)</p>
                </div>
             </div>

             {/* Fuel Map Link */}
             <button
               onClick={() => openGoogleMaps(getMapQuery())}
               className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl mb-6 flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer"
             >
               <MapPin size={16} className="mr-2" /> {t.find_maps}
             </button>

             <div className="flex items-center space-x-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                <Car size={20} className="text-gray-400" aria-hidden="true" />
                <div className="flex-1">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">{t.refueling_vehicle}</p>
                   <p className="font-bold text-gray-900 text-sm">{MOCK_USER_PROFILE.vehicles[0]?.plate || 'N/A'}</p>
                </div>
                <button className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 shadow-sm">{t.change}</button>
             </div>
          </div>
       )}

       {/* Medical Logic (ISS) */}
       {program.category === 'medical' && (
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-gray-900 text-lg">{t.panel_clinic}</h3>
             </div>
             
             {/* Medical Map Link */}
             <button 
               onClick={() => openGoogleMaps(getMapQuery())}
               className="w-full h-44 bg-emerald-50 rounded-2xl relative overflow-hidden mb-4 border border-emerald-100 cursor-pointer group hover:shadow-md transition-all text-left"
               aria-label="Find clinics on Google Maps"
             >
                <div className="absolute inset-0 flex items-center justify-center">
                   <MapPin className="text-emerald-600 drop-shadow-lg group-hover:scale-110 transition-transform" size={40} fill="currentColor" />
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center text-emerald-800">
                   <Stethoscope size={12} className="mr-1.5" /> {t.find_maps}
                </div>
             </button>
          </div>
       )}
    </div>
  );

  // SECTION D: APPLY / UPDATE
  const renderApply = () => (
    <div className="space-y-6 animate-slide-up pb-24 pt-2">
       {!formSuccess ? (
          <>
             <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-sm text-orange-800 flex items-start space-x-3" role="alert">
               <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
               <p className="font-medium">{t.please_ensure}</p>
             </div>

             <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-5">
                <h3 className="font-bold text-gray-900">{t.applicant_details}</h3>
                {/* Fields code ... */}
                <div className="grid grid-cols-1 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">{t.full_name}</label>
                      <div className="bg-gray-50 p-3.5 rounded-xl font-bold text-gray-600 flex justify-between items-center border border-gray-100">
                         {MOCK_USER_PROFILE.name}
                         <Lock size={14} className="text-gray-400" aria-hidden="true"/>
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">{t.ic_number}</label>
                      <div className="bg-gray-50 p-3.5 rounded-xl font-bold text-gray-600 flex justify-between items-center border border-gray-100">
                         {MOCK_USER_PROFILE.icNumber}
                         <Lock size={14} className="text-gray-400" aria-hidden="true"/>
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">{t.household_income}</label>
                      <div className="bg-white border-2 border-gray-100 rounded-xl p-3.5 font-bold text-gray-900 flex justify-between items-center">
                         <span className="flex items-center"><span className="text-gray-400 mr-1">RM</span> {MOCK_USER_PROFILE.householdIncome}</span>
                         <Edit3 size={16} className="text-gray-400" aria-hidden="true"/>
                      </div>
                   </div>
                </div>
             </div>

             {/* Documents Section */}
             <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
                 <h3 className="font-bold text-gray-800">{t.required_documents}</h3>
                 <button 
                    onClick={() => setShowDocSelector(true)}
                    className={`w-full border-2 ${attachedDoc ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-200'} rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group focus:ring-2 focus:ring-blue-500 relative overflow-hidden`}
                 >
                    {attachedDoc ? (
                       <div className="flex flex-col items-center animate-fade-in">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600">
                             <CheckCircle size={24} />
                          </div>
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{attachedDoc.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{t.income_proof} • Attached</p>
                          <span className="absolute top-2 right-2 text-[10px] text-green-600 font-bold bg-white px-2 py-0.5 rounded-full border border-green-100">CHANGE</span>
                       </div>
                    ) : (
                       <>
                         <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                            <UploadCloud size={24} className="text-madani-blue" aria-hidden="true" />
                         </div>
                         <p className="font-bold text-gray-700 text-sm">{t.income_proof}</p>
                         <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wide">{t.pdf_limit}</p>
                       </>
                    )}
                 </button>
             </div>

             <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">{t.save_draft}</button>
                <button 
                  onClick={handleFormSubmit}
                  disabled={formSubmitting || !attachedDoc}
                  className="flex-[2] bg-madani-blue text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center hover:bg-blue-900 transition-colors active:scale-95 disabled:opacity-50 disabled:shadow-none"
                >
                   {formSubmitting ? t.submitting : t.submit_application}
                </button>
             </div>
          </>
       ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-scale-in" role="alert">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-inner">
                 <CheckCircle size={48} aria-hidden="true" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-gray-900">{t.application_submitted}</h3>
                 <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm leading-relaxed">{t.pending_review}</p>
              </div>
              <button onClick={() => setFormSuccess(false)} className="text-madani-blue font-bold py-2 px-4 rounded-xl hover:bg-blue-50 transition-colors">{t.back_to_wallet}</button>
          </div>
       )}
       
       {/* Document Selector Bottom Sheet */}
       {showDocSelector && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDocSelector(false)}></div>
              <div className="bg-white w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-slide-up max-h-[70vh] flex flex-col shadow-2xl">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
                  <div className="flex justify-between items-center mb-6 shrink-0">
                      <h3 className="text-lg font-bold text-gray-900">Select Document</h3>
                      <button onClick={() => setShowDocSelector(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                          <X size={20} className="text-gray-600" />
                      </button>
                  </div>
                  
                  <div className="overflow-y-auto no-scrollbar space-y-3 mb-4">
                      {/* Option: From Device */}
                      <button 
                        onClick={() => {
                          // Simulate device upload for application
                          handleSelectDoc({ id: 'temp', name: 'New_Scan.pdf', date: 'Just now', size: '1.2 MB', type: 'pdf' });
                        }}
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors text-left"
                      >
                         <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                            <UploadCloud size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 text-sm">Upload from Device</p>
                            <p className="text-xs text-gray-400">Choose file from phone storage</p>
                         </div>
                      </button>

                      <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-100"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase px-3">Or choose from saved</span>
                        <div className="flex-1 h-px bg-gray-100"></div>
                      </div>

                      {/* Saved Docs List */}
                      {savedDocs.map(doc => (
                         <button 
                           key={doc.id}
                           onClick={() => handleSelectDoc(doc)}
                           className={`w-full flex items-center space-x-4 p-4 rounded-2xl border transition-all text-left group ${attachedDoc?.id === doc.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'}`}
                         >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                               {doc.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-700">{doc.name}</p>
                               <div className="flex items-center space-x-2 mt-0.5">
                                 <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded">{doc.type.toUpperCase()}</span>
                                 <span className="text-[10px] text-gray-400">{doc.date}</span>
                               </div>
                            </div>
                            {attachedDoc?.id === doc.id && (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                                    <Check size={14} className="text-white" strokeWidth={3} />
                                </div>
                            )}
                         </button>
                      ))}

                      {savedDocs.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm font-medium text-gray-500">No saved documents found.</p>
                            <p className="text-xs text-gray-400 mt-1">Go to Profile to manage your docs.</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>
       )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col animate-slide-up overflow-hidden">
       {/* Header */}
       <div className="bg-white px-6 pt-12 pb-4 shadow-sm border-b border-gray-100 shrink-0 z-10 relative">
          <div className="flex items-center justify-between mb-6">
             <button 
               onClick={onClose}
               className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
             >
                <ChevronLeft size={24} />
             </button>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{program.programCode}</span>
                <h1 className="text-lg font-black text-gray-900 leading-none">{program.category === 'fuel' ? 'Fuel Subsidy' : 'Wallet Details'}</h1>
             </div>
             <button className="w-10 h-10 flex items-center justify-center text-gray-400">
                <HelpCircle size={24} />
             </button>
          </div>
          
          {/* User Profile Image */}
          <div className="flex justify-center mb-4">
             <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                <img 
                   src="/user profile page.jpeg" 
                   alt="User Profile" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                      // Fallback to a default image if the specified one doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = "https://picsum.photos/id/1005/200/300";
                   }}
                />
             </div>
          </div>

          {/* Tab Switcher - iOS Segmented Control Style */}
          <div className="bg-gray-100 p-1 rounded-xl flex font-bold text-xs relative">
             {/* Animated Background Pill */}
             <div 
               className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
               style={{
                  left: activeTab === 'overview' ? '4px' : activeTab === 'wallet' ? '25%' : activeTab === 'info' ? '50%' : '75%',
                  width: 'calc(25% - 6px)'
               }}
             />
             
             {['overview', 'wallet', 'info', 'apply'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`flex-1 py-2.5 rounded-lg relative z-10 transition-colors capitalize ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                   {t[`tab_${tab}` as keyof typeof t]}
                </button>
             ))}
          </div>
       </div>

       {/* Content Scroll Area */}
       <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'wallet' && renderWallet()}
          {activeTab === 'info' && renderInfo()}
          {activeTab === 'apply' && renderApply()}
       </div>
    </div>
  );
};

export default WalletDetailView;
