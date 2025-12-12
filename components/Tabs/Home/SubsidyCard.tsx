
import React from 'react';
import { SubsidyProgram } from '../../../types';
import { AlertCircle, ChevronRight, QrCode, Zap, Clock, CheckCircle2 } from 'lucide-react';

interface SubsidyCardProps {
  program: SubsidyProgram;
  onClick: () => void;
}

const SubsidyCard: React.FC<SubsidyCardProps> = ({ program, onClick }) => {
  const isEligible = program.eligibilityStatus === 'eligible' || program.applicationStatus === 'approved';

  // Helper to format currency/units
  const formatBalance = () => {
    const unit = program.quotaUnit === 'RM' || program.quotaUnit === null ? 'RM' : '';
    const suffix = program.quotaUnit && program.quotaUnit !== 'RM' ? (program.quotaUnit === 'litres' ? ' L' : ` ${program.quotaUnit}`) : '';
    return { unit, value: program.currentBalance.toLocaleString(), suffix };
  };

  const { unit, value, suffix } = formatBalance();
  const percentage = program.totalAllocated > 0 ? Math.min((program.currentBalance / program.totalAllocated) * 100, 100) : 0;

  // Construct a screen-reader friendly summary
  const a11yLabel = `${program.programName} (${program.programCode}). Balance: ${unit}${value}${suffix}. Status: ${isEligible ? 'Active' : 'Pending'}. ${program.alertMessage ? `Alert: ${program.alertMessage}` : ''}`;

  return (
    <button
      type="button"
      aria-label={a11yLabel}
      onClick={onClick}
      className="group relative w-full text-left bg-white rounded-[1.75rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-500/30 z-10"
    >
      {/* Alert Banner (Inline) */}
      {program.alertMessage && (
         <div className={`absolute top-0 left-0 right-0 h-1.5 ${program.alertType === 'urgent' ? 'bg-red-500' : 'bg-amber-400'}`} aria-hidden="true"></div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-5" aria-hidden="true">
         <div className="flex items-center gap-4">
            {/* Icon Container - Background Removed */}
            <div className="w-14 h-14 flex items-center justify-center">
               <span className="text-4xl leading-none">{program.icon || <span className="text-2xl font-bold text-gray-900">{program.programName.charAt(0)}</span>}</span>
            </div>
            
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{program.programCode}</h3>
                  {program.alertMessage && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
               </div>
               <p className="text-sm font-medium text-gray-500 line-clamp-1">{program.programName}</p>
            </div>
         </div>

         {/* Status Pill */}
         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center ${isEligible ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'}`}>
            {isEligible ? (
               <>Active <CheckCircle2 size={10} className="ml-1 text-green-500 fill-green-500" /></>
            ) : (
               <>Pending <Clock size={10} className="ml-1" /></>
            )}
         </div>
      </div>

      {/* Alert Text (If present) */}
      {program.alertMessage && (
        <div className="mb-4 bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium text-gray-600" aria-hidden="true">
           <AlertCircle size={14} className={program.alertType === 'urgent' ? 'text-red-500' : 'text-amber-500'} />
           <span className="truncate">{program.alertMessage}</span>
        </div>
      )}

      {/* Balance & Stats */}
      <div className="flex items-end justify-between mb-6" aria-hidden="true">
         <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Available Balance</p>
            <div className="flex items-baseline gap-1 text-gray-900">
               <span className="text-sm font-bold opacity-60 transform -translate-y-1">{unit}</span>
               <span className="text-4xl font-extrabold tracking-tighter">{value}</span>
               <span className="text-lg font-bold text-gray-400">{suffix}</span>
            </div>
         </div>
         
         {/* Circular Progress or Simple Stat */}
         {program.totalAllocated > 0 && (
            <div className="text-right">
               <p className="text-xs font-bold text-gray-900">{percentage.toFixed(0)}%</p>
               <div className="w-12 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className={`h-full rounded-full ${program.color}`} style={{ width: `${percentage}%` }}></div>
               </div>
            </div>
         )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-3">
         {/* Primary Action Button - Visual Only */}
         {isEligible ? (
           <div 
             className="flex-1 bg-black text-white h-12 rounded-2xl text-sm font-semibold flex items-center justify-center shadow-md hover:bg-gray-900 active:scale-95 transition-all group"
           >
              {program.category === 'fuel' ? (
                <>
                  <Zap size={16} className="mr-2 text-yellow-400 fill-yellow-400" /> Refuel Now
                </>
              ) : (
                <>
                  <QrCode size={16} className="mr-2" /> Pay / Scan
                </>
              )}
           </div>
         ) : (
           <div className="flex-1 bg-gray-50 text-gray-400 h-12 rounded-2xl text-sm font-bold flex items-center justify-center cursor-not-allowed">
              Not Eligible
           </div>
         )}

         {/* Secondary Details Button - Visual Only */}
         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <ChevronRight size={20} />
         </div>
      </div>
    </button>
  );
};

export default SubsidyCard;
