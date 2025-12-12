
import React from 'react';
import { NOTIFICATIONS, STRINGS } from '../../../constants';
import { Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface NotificationCenterProps {
  lang?: 'ms' | 'en' | 'zh' | 'ta';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ lang = 'ms' }) => {
  const t = STRINGS[lang];
  const priority = NOTIFICATIONS.filter(n => n.type === 'priority');
  const status = NOTIFICATIONS.filter(n => n.type === 'status');
  const news = NOTIFICATIONS.filter(n => n.type === 'news');

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.notifications_title}</h1>

      {/* Priority Section */}
      {priority.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t.urgent_section}</h2>
          {priority.map(n => (
            <div key={n.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-start space-x-3">
              <AlertTriangle className="text-red-500 shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{n.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                <div className="flex items-center mt-2 text-red-600 text-xs font-semibold">
                   <Clock size={12} className="mr-1" /> {t.due_in_3_days}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Section */}
      {status.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t.applications_section}</h2>
          {status.map(n => (
            <div key={n.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
                 <CheckCircle2 size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{n.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{n.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {/* News Section */}
      {news.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t.news_section}</h2>
          {news.map(n => (
            <div key={n.id} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex space-x-3 hover:bg-gray-50 transition-colors">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                 {n.imageUrl ? (
                    <img src={n.imageUrl} alt="" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                       <Info size={24} />
                    </div>
                 )}
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                   <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">{n.title}</h3>
                   <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-2">{n.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
