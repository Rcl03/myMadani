
import React, { useState, useRef } from 'react';
import { ShieldCheck, Share2, QrCode, CreditCard, RefreshCw, Car, MapPin, Bell, LogOut, ChevronRight, FileText, Lock, User, ScanLine, Wallet, ChevronLeft, Save, Upload, X, Check, File, Loader2, Image as ImageIcon, Trash2, Download, Eye } from 'lucide-react';
import { STRINGS, MOCK_USER_PROFILE } from '../../../constants';
import { UserProfile, Doc } from '../../../types';
import BiometricVerifier from '../../Auth/BiometricVerifier';
import { getImagePath } from '../../../utils/imagePath';

interface DigitalIDWalletProps {
  lang: 'ms' | 'en' | 'zh' | 'ta';
  docs: Doc[];
  onUpdateDocs: (docs: Doc[]) => void;
}

const DigitalIDWallet: React.FC<DigitalIDWalletProps> = ({ lang, docs, onUpdateDocs }) => {
  const [currentView, setCurrentView] = useState<'wallet' | 'personal' | 'documents'>('wallet');
  const [viewingDoc, setViewingDoc] = useState<Doc | null>(null);
  
  // Wallet State
  const [renewalAction, setRenewalAction] = useState<string | null>(null);
  const [showBiometric, setShowBiometric] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Personal Details State
  // Extending mock profile with local editable fields
  const [profile, setProfile] = useState({
    ...MOCK_USER_PROFILE,
    email: 'gan.zixiang@email.com',
    phone: '+60 12-345 6789',
    occupation: 'Software Engineer'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Documents State handled by parent (App.tsx)
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const t = STRINGS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define cards used in wallet view
  const cards = [
    { id: 'mykad', type: 'mykad' },
    { id: 'license', type: 'license' },
    { id: 'passport', type: 'passport' },
  ];

  // --- WALLET LOGIC ---
  const handleActionClick = (action: string) => {
    setRenewalAction(action);
    setShowBiometric(true);
  };

  const handleVerificationComplete = () => {
    setShowBiometric(false);
    setTimeout(() => {
        setPaymentSuccess(true);
        setTimeout(() => {
            setPaymentSuccess(false);
            setRenewalAction(null);
        }, 2000);
    }, 500);
  };

  const cycleCards = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  // --- PERSONAL DETAILS LOGIC ---
  const handleSaveProfile = () => {
      setSaveLoading(true);
      // Mock API call
      setTimeout(() => {
          setSaveLoading(false);
          setIsEditing(false);
          // Show quick success feedback (could be toast, using alert for simple demo or just visual change)
      }, 1500);
  };

  // --- DOCUMENTS LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setShowUploadSheet(false);
          setIsUploading(true);
          setUploadProgress(0);

          // Create a local URL for preview
          const previewUrl = URL.createObjectURL(file);

          // Simulate upload progress
          const interval = setInterval(() => {
              setUploadProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      return 100;
                  }
                  return prev + 10;
              });
          }, 200);

          setTimeout(() => {
              clearInterval(interval);
              setIsUploading(false);
              onUpdateDocs([{
                  id: Date.now().toString(),
                  name: file.name,
                  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                  size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                  type: file.type.includes('pdf') ? 'pdf' : 'img',
                  fileUrl: previewUrl
              }, ...docs]);
          }, 2500);
      }
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  };

  if (showBiometric) {
      return <BiometricVerifier onVerifyComplete={handleVerificationComplete} isPayment={true} />;
  }

  // --- RENDER HELPERS ---

  const renderHeader = (title: string, onBack: () => void, rightAction?: React.ReactNode) => (
      <div className="flex items-center justify-between mb-8">
          <button 
             onClick={onBack} 
             className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
              <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <div className="w-10 flex justify-end">
              {rightAction}
          </div>
      </div>
  );

  // --- VIEW: PERSONAL DETAILS ---
  if (currentView === 'personal') {
      return (
          <div className="pt-12 px-6 pb-32 h-full overflow-y-auto no-scrollbar bg-gray-50">
              {renderHeader(t.personal_details, () => setCurrentView('wallet'), 
                  !isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="text-madani-blue font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg">Edit</button>
                  ) : null
              )}

              <div className="space-y-6 animate-slide-up">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center mb-8">
                      <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                          <img src={getImagePath("/user profile page.jpeg")} alt="Profile" className="w-full h-full object-cover" />
                          {isEditing && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
                                  <Upload size={20} className="text-white" />
                              </div>
                          )}
                      </div>
                      <p className="mt-3 text-sm text-gray-500 font-bold">{profile.icNumber}</p>
                  </div>

                  {/* Form Fields */}
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-5">
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Full Name (as per MyKad)</label>
                          <input 
                              type="text" 
                              value={profile.name}
                              disabled={true} // Name usually locked
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-gray-500 font-bold cursor-not-allowed"
                          />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-5">
                         <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Email Address</label>
                              <input 
                                  type="email" 
                                  value={profile.email}
                                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                                  disabled={!isEditing}
                                  className={`w-full border rounded-xl p-3.5 font-bold text-gray-900 transition-colors ${isEditing ? 'bg-white border-blue-200 focus:ring-2 focus:ring-blue-100' : 'bg-transparent border-gray-100'}`}
                              />
                         </div>
                         <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Phone Number</label>
                              <input 
                                  type="tel" 
                                  value={profile.phone}
                                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                  disabled={!isEditing}
                                  className={`w-full border rounded-xl p-3.5 font-bold text-gray-900 transition-colors ${isEditing ? 'bg-white border-blue-200 focus:ring-2 focus:ring-blue-100' : 'bg-transparent border-gray-100'}`}
                              />
                         </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Current Address</label>
                          <textarea 
                              value={profile.address}
                              onChange={(e) => setProfile({...profile, address: e.target.value})}
                              disabled={!isEditing}
                              rows={3}
                              className={`w-full border rounded-xl p-3.5 font-bold text-gray-900 transition-colors resize-none ${isEditing ? 'bg-white border-blue-200 focus:ring-2 focus:ring-blue-100' : 'bg-transparent border-gray-100'}`}
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Occupation</label>
                          <input 
                              type="text" 
                              value={profile.occupation}
                              onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                              disabled={!isEditing}
                              className={`w-full border rounded-xl p-3.5 font-bold text-gray-900 transition-colors ${isEditing ? 'bg-white border-blue-200 focus:ring-2 focus:ring-blue-100' : 'bg-transparent border-gray-100'}`}
                          />
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Household Income</label>
                          <div className={`flex items-center w-full border rounded-xl px-3.5 transition-colors ${isEditing ? 'bg-white border-blue-200 focus-within:ring-2 focus-within:ring-blue-100' : 'bg-transparent border-gray-100'}`}>
                             <span className="text-gray-500 font-bold mr-2">RM</span>
                             <input 
                                  type="number" 
                                  value={profile.householdIncome}
                                  onChange={(e) => setProfile({...profile, householdIncome: parseInt(e.target.value) || 0})}
                                  disabled={!isEditing}
                                  className="flex-1 bg-transparent border-none focus:ring-0 py-3.5 font-bold text-gray-900"
                              />
                          </div>
                      </div>
                  </div>
              </div>

              {isEditing && (
                  <div className="fixed bottom-24 left-0 right-0 px-6 animate-slide-up z-20">
                      <div className="max-w-md mx-auto flex space-x-3">
                          <button 
                             onClick={() => setIsEditing(false)}
                             className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-xl shadow-lg"
                             disabled={saveLoading}
                          >
                             Cancel
                          </button>
                          <button 
                             onClick={handleSaveProfile}
                             disabled={saveLoading}
                             className="flex-[2] bg-madani-blue text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-900/20 flex items-center justify-center active:scale-95 transition-all"
                          >
                             {saveLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2"/> Save Changes</>}
                          </button>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- VIEW: DOCUMENTS ---
  if (currentView === 'documents') {
      return (
          <div className="pt-12 px-6 pb-32 h-full overflow-y-auto no-scrollbar bg-gray-50 relative">
              {renderHeader(t.my_documents, () => setCurrentView('wallet'), 
                  <button onClick={() => setShowUploadSheet(true)} className="w-10 h-10 bg-madani-blue rounded-full shadow-lg shadow-blue-900/20 flex items-center justify-center text-white active:scale-95 transition-all">
                      <Upload size={18} />
                  </button>
              )}

              {/* Upload Progress Card */}
              {isUploading && (
                  <div className="mb-6 bg-white rounded-2xl p-4 shadow-md border border-gray-100 animate-slide-up">
                      <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                             <FileText size={20} className="animate-bounce" />
                          </div>
                          <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">Uploading Document...</p>
                              <p className="text-xs text-gray-400">{uploadProgress}% complete</p>
                          </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-madani-blue h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                  </div>
              )}

              {/* Document List */}
              <div className="space-y-3 animate-slide-up">
                  {docs.map((doc) => (
                      <div 
                         key={doc.id} 
                         onClick={() => setViewingDoc(doc)}
                         className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer hover:border-blue-200"
                      >
                          <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                  {doc.type === 'pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{doc.name}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">{doc.type.toUpperCase()}</span>
                                      <span className="text-[10px] text-gray-400">• {doc.size}</span>
                                      <span className="text-[10px] text-gray-400">• {doc.date}</span>
                                  </div>
                              </div>
                          </div>
                          <div className="flex items-center space-x-1">
                              <button className="p-2 text-gray-300 hover:text-blue-500 transition-colors">
                                  <Eye size={18} />
                              </button>
                              <button 
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     onUpdateDocs(docs.filter(d => d.id !== doc.id));
                                 }}
                                 className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                  <Trash2 size={18} />
                              </button>
                          </div>
                      </div>
                  ))}
                  
                  {docs.length === 0 && !isUploading && (
                      <div className="text-center py-10 opacity-50">
                          <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                      </div>
                  )}
              </div>

              {/* Document Viewer Modal */}
              {viewingDoc && (
                  <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col animate-fade-in">
                      <div className="flex justify-between items-center p-6 text-white shrink-0">
                          <h3 className="font-bold text-lg truncate pr-4">{viewingDoc.name}</h3>
                          <button 
                            onClick={() => setViewingDoc(null)} 
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                              <X size={24} />
                          </button>
                      </div>
                      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                           {/* Handle PDF vs Image - For mock PDF with placeholder URL, display as image */}
                           {(viewingDoc.type === 'pdf' && !viewingDoc.fileUrl?.includes('placehold.co')) ? (
                               <iframe 
                                 src={viewingDoc.fileUrl} 
                                 className="w-full h-full bg-white rounded-lg" 
                                 title={viewingDoc.name}
                               ></iframe>
                           ) : (
                               <img 
                                 src={viewingDoc.fileUrl || `https://placehold.co/600x800/EEE/31343C?text=${encodeURIComponent(viewingDoc.name)}`} 
                                 alt={viewingDoc.name} 
                                 className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                               />
                           )}
                      </div>
                      <div className="p-6 bg-black flex justify-center space-x-12 text-white/70 shrink-0">
                           <button className="flex flex-col items-center gap-2 hover:text-white transition-colors">
                             <Share2 size={24} />
                             <span className="text-xs font-medium">Share</span>
                           </button>
                           <button className="flex flex-col items-center gap-2 hover:text-white transition-colors">
                             <Download size={24} />
                             <span className="text-xs font-medium">Save</span>
                           </button>
                      </div>
                  </div>
              )}

              {/* Upload Bottom Sheet */}
              {showUploadSheet && (
                  <div className="fixed inset-0 z-50 flex items-end justify-center">
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUploadSheet(false)}></div>
                      <div className="bg-white w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-slide-up">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                          <h3 className="text-lg font-bold text-gray-900 mb-6">Upload Document</h3>
                          
                          <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileUpload}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                              <button onClick={triggerFileSelect} className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors">
                                  <FileText size={32} className="mb-3" />
                                  <span className="font-bold text-sm">Salary Slip</span>
                              </button>
                              <button onClick={triggerFileSelect} className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-orange-700 hover:bg-orange-100 transition-colors">
                                  <Wallet size={32} className="mb-3" />
                                  <span className="font-bold text-sm">Utility Bill</span>
                              </button>
                              <button onClick={triggerFileSelect} className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-green-700 hover:bg-green-100 transition-colors">
                                  <File size={32} className="mb-3" />
                                  <span className="font-bold text-sm">Supporting Doc</span>
                              </button>
                              <button onClick={() => setShowUploadSheet(false)} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                                  <X size={32} className="mb-3" />
                                  <span className="font-bold text-sm">Cancel</span>
                              </button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- VIEW: MAIN WALLET ---
  return (
    <div className="pt-16 px-6 pb-48 flex flex-col items-center h-full overflow-y-auto no-scrollbar bg-gray-50">
      
      {/* Header - Minimal Title without Settings Icon */}
      {/* Increased spacing below header */}
      <div className="w-full flex items-center justify-between mb-16">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t.personal}</h1>
      </div>

      {/* Interactive 3D Stack */}
      {/* Drastically increased margin-bottom to mb-44 to ensure absolutely no blocking */}
      <div 
        onClick={cycleCards}
        className="relative w-full max-w-sm h-56 perspective-1000 cursor-pointer group z-10 mx-auto mb-44"
      >
         {cards.map((card, index) => {
            // Calculate relative position based on active index
            // 0 = Front, 1 = Middle, 2 = Back
            const position = (index - activeIndex + cards.length) % cards.length;
            
            // Visual styles based on position
            let transformClass = '';
            let zIndexClass = '';
            let opacityClass = '';

            if (position === 0) {
                // Front
                transformClass = 'scale-100 translate-y-0';
                zIndexClass = 'z-30';
                opacityClass = 'opacity-100 shadow-2xl';
            } else if (position === 1) {
                // Middle
                transformClass = 'scale-95 -translate-y-6';
                zIndexClass = 'z-20';
                opacityClass = 'opacity-80 shadow-xl';
            } else {
                // Back
                transformClass = 'scale-90 -translate-y-12';
                zIndexClass = 'z-10';
                opacityClass = 'opacity-60 shadow-lg';
            }

            return (
                <div 
                    key={card.id}
                    className={`absolute top-0 left-0 w-full h-56 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform-gpu ${transformClass} ${zIndexClass} ${opacityClass}`}
                >
                    {/* --- MYKAD (IC) DESIGN --- */}
                    {card.type === 'mykad' && (
                       <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white border border-blue-500 overflow-hidden relative shadow-inner">
                           {/* Decorative Curve */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                           
                           {/* Header */}
                           <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center space-x-2">
                                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Coat_of_arms_of_Malaysia.svg" className="w-8 h-8 drop-shadow-md" alt="Jata" />
                                   <div>
                                       <p className="text-[8px] font-bold tracking-widest text-blue-200 uppercase">Malaysia</p>
                                       <p className="text-[10px] font-bold tracking-widest uppercase text-white">Kad Pengenalan</p>
                                   </div>
                               </div>
                               <div className="w-10 h-7 bg-yellow-400/20 rounded border border-yellow-400/40 flex items-center justify-center">
                                   {/* Chip Simulation */}
                                   <div className="w-6 h-4 border border-yellow-500/60 rounded-[2px] bg-yellow-500/20 relative">
                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-500/40"></div>
                                        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-yellow-500/40"></div>
                                   </div>
                               </div>
                           </div>

                           {/* Content */}
                           <div className="flex space-x-4">
                               <div className="w-20 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-white/20 shadow-inner shrink-0">
                                   <img src={getImagePath("/user profile page.jpeg")} alt="Profile" className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 space-y-2 pt-1">
                                   <div>
                                       <p className="text-[9px] text-blue-200 uppercase">Nama / Name</p>
                                       <p className="text-sm font-bold truncate leading-tight">{profile.name.toUpperCase()}</p>
                                   </div>
                                   <div>
                                       <p className="text-[9px] text-blue-200 uppercase">No. KP / Identity No.</p>
                                       <p className="text-sm font-bold font-mono tracking-wide">{profile.icNumber}</p>
                                   </div>
                                   <div>
                                       <p className="text-[9px] text-blue-200 uppercase">Alamat / Address</p>
                                       <p className="text-[9px] font-medium leading-tight line-clamp-2 opacity-90">{profile.address}</p>
                                   </div>
                               </div>
                           </div>
                           
                           <div className="absolute bottom-3 right-4 flex items-center space-x-1">
                               <div className="bg-blue-900/50 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-blue-200 border border-blue-400/30">
                                  WARGANEGARA
                               </div>
                           </div>
                       </div>
                    )}

                    {/* --- DRIVING LICENSE DESIGN --- */}
                    {card.type === 'license' && (
                       <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative border border-gray-200 shadow-inner">
                           {/* Pinkish/Red Header */}
                           <div className="h-12 bg-gradient-to-r from-rose-500 to-pink-600 w-full px-4 flex items-center justify-between shadow-sm relative z-10">
                               <div className="flex items-center space-x-2">
                                   <div className="w-6 h-6 bg-white/20 rounded-full p-1">
                                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Coat_of_arms_of_Malaysia.svg" className="w-full h-full" alt="Jata" />
                                   </div>
                                   <span className="text-white font-bold text-[10px] tracking-wider uppercase">Lesen Memandu Malaysia</span>
                               </div>
                           </div>

                           {/* Body */}
                           <div className="p-4 bg-gradient-to-b from-white to-pink-50/50 h-full relative">
                               {/* Watermark */}
                               <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                   <Car size={120} />
                               </div>

                               <div className="flex space-x-4">
                                   <div className="w-16 h-20 bg-gray-100 rounded-md border border-gray-300 overflow-hidden shrink-0 mt-2">
                                      <img src={getImagePath("/user profile page.jpeg")} alt="Profile" className="w-full h-full object-cover" />
                                   </div>
                                   <div className="space-y-1 mt-1 w-full text-gray-800">
                                       <div className="flex justify-between items-start">
                                           <div>
                                               <p className="text-[8px] text-gray-500 uppercase font-bold">Nama / Name</p>
                                               <p className="text-xs font-bold leading-tight">{profile.name}</p>
                                           </div>
                                           <div className="text-center bg-gray-100 px-2 py-1 rounded">
                                               <p className="text-[8px] text-gray-500 uppercase font-bold">Class</p>
                                               <p className="text-sm font-black text-gray-900">D</p>
                                           </div>
                                       </div>
                                       <div className="grid grid-cols-2 gap-2 mt-2">
                                           <div>
                                               <p className="text-[8px] text-gray-500 uppercase font-bold">Tempoh / Validity</p>
                                               <p className="text-xs font-bold">15/06/2026</p>
                                           </div>
                                           <div>
                                               <p className="text-[8px] text-gray-500 uppercase font-bold">No. KP</p>
                                               <p className="text-xs font-bold">{profile.icNumber.substring(0, 8)}..</p>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               <div className="mt-3 border-t border-dashed border-gray-300 pt-2 flex justify-between items-center">
                                   <p className="text-[9px] text-gray-400">Probationary Period: <span className="text-gray-600">N/A</span></p>
                                   <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                       COMPETENT (CDL)
                                   </div>
                               </div>
                           </div>
                       </div>
                    )}

                    {/* --- PASSPORT DESIGN --- */}
                    {card.type === 'passport' && (
                       <div className="w-full h-full bg-[#800000] rounded-2xl p-4 text-yellow-500 border border-red-900 relative overflow-hidden shadow-inner flex flex-col justify-between">
                           
                           {/* Header */}
                           <div className="flex flex-col items-center pt-2">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Coat_of_arms_of_Malaysia.svg" className="w-8 h-8 mb-1 drop-shadow-md brightness-150 contrast-125 sepia" alt="Jata" style={{ filter: 'invert(16%) sepia(86%) saturate(2856%) hue-rotate(358deg) brightness(98%) contrast(106%)'}} /> 
                               <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-400 drop-shadow-sm">Malaysia</h2>
                               <h3 className="text-[8px] tracking-[0.2em] uppercase text-yellow-500/80 mt-0.5">Pasport / Passport</h3>
                           </div>
                           
                           {/* Centered QR Code */}
                           <div className="flex items-center justify-center mb-1">
                              <div className="bg-white p-2 rounded-xl shadow-lg">
                                  <QrCode size={60} className="text-black" />
                              </div>
                           </div>

                           {/* Footer Info Row - Strictly One Line */}
                           <div className="flex items-end justify-between w-full text-[8px] text-yellow-500/60 uppercase tracking-widest font-semibold pb-1 px-1 whitespace-nowrap">
                               <div className="w-1/3 text-left">P Type</div>
                               <div className="w-1/3 text-center">MYS Code</div>
                               <div className="w-1/3 text-right">No. A12345678</div>
                           </div>
                       </div>
                    )}
                </div>
            );
         })}
      </div>

      {/* Extra Large Spacer to prevent blocking */}
      <div className="w-full h-24 shrink-0"></div>

      {/* Success Message Overlay */}
      {paymentSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white p-8 rounded-3xl text-center shadow-2xl transform scale-110">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                  <p className="text-gray-500 mt-2">{renewalAction} verified.</p>
              </div>
          </div>
      )}

      {/* Main Content Sections */}
      <div className="w-full space-y-8 animate-slide-up">
        
        {/* Quick Services Grid (Renewal) */}
        <div>
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{t.quick_actions}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* 1. Renew MyKad */}
                <button 
                  onClick={() => handleActionClick(t.apply_replacement)} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:bg-gray-50 active:scale-95 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                        <ScanLine size={20}/>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-sm block mb-1">MyKad</span>
                      <span className="text-[10px] font-medium text-gray-400 block leading-tight">{t.apply_replacement}</span>
                    </div>
                </button>

                {/* 2. Passport Renewal */}
                <button 
                  onClick={() => handleActionClick(t.renew_passport)} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:bg-gray-50 active:scale-95 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
                        <Wallet size={20}/>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-sm block mb-1">Passport</span>
                      <span className="text-[10px] font-medium text-gray-400 block leading-tight">{t.renew_validity}</span>
                    </div>
                </button>

                {/* 3. License Renewal */}
                <button 
                  onClick={() => handleActionClick(t.renew_license)} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:bg-gray-50 active:scale-95 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <RefreshCw size={20}/>
                    </div>
                    <div>
                       <span className="font-bold text-gray-900 text-sm block mb-1">Driving License</span>
                       <span className="text-[10px] font-medium text-gray-400 block leading-tight">Exp: Jun 2026</span>
                    </div>
                </button>

                {/* 4. Road Tax */}
                <button 
                  onClick={() => handleActionClick(t.pay_roadtax)} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:bg-gray-50 active:scale-95 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                        <Car size={20}/>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-sm block mb-1">Road Tax</span>
                      <span className="text-[10px] font-bold text-red-500 block leading-tight">{t.due_soon}</span>
                    </div>
                </button>
            </div>
        </div>

        {/* Account Settings List */}
        <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 px-1">{t.settings}</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
               
               <div 
                  onClick={() => setCurrentView('personal')}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group"
               >
                  <div className="flex items-center space-x-3">
                     <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <User size={18} />
                     </div>
                     <span className="text-sm font-bold text-gray-700">{t.personal_details}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>

               <div 
                  onClick={() => setCurrentView('documents')}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group"
               >
                  <div className="flex items-center space-x-3">
                     <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FileText size={18} />
                     </div>
                     <span className="text-sm font-bold text-gray-700">{t.my_documents}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>

               <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center space-x-3">
                     <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Lock size={18} />
                     </div>
                     <span className="text-sm font-bold text-gray-700">{t.security_privacy}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>

               <div className="p-4 flex items-center justify-between hover:bg-red-50 cursor-pointer transition-colors group">
                  <div className="flex items-center space-x-3">
                     <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <LogOut size={18} />
                     </div>
                     <span className="text-sm font-bold text-red-600">{t.sign_out}</span>
                  </div>
               </div>

            </div>
        </div>

        {/* Footer info */}
        <div className="text-center pb-6">
           <p className="text-[10px] text-gray-400 font-medium">MyMadani App Version 2.4.1</p>
           <p className="text-[10px] text-gray-300 mt-1">Government of Malaysia © 2024</p>
        </div>

      </div>
    </div>
  );
};

export default DigitalIDWallet;
