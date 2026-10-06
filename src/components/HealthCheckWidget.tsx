import React, { useState } from 'react';
import { checkHealth } from '../services/healthService';
import { Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react';

type HealthStatus = 'idle' | 'loading' | 'success' | 'error';

export const HealthCheckWidget: React.FC = () => {
  const [status, setStatus] = useState<HealthStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const handleCheckHealth = async () => {
    setStatus('loading');
    setMessage('Đang kết nối...');

    const isUp = await checkHealth();

    if (isUp) {
      setStatus('success');
      setMessage('Kết nối Backend: Thành công (UP)');
    } else {
      setStatus('error');
      setMessage('Lỗi kết nối. Vui lòng kiểm tra Console.');
    }
    
    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {status !== 'idle' && (
        <div 
          className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 ${
            status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            status === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-5 h-5" />}
          {status === 'error' && <XCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{message}</span>
        </div>
      )}

      <button
        onClick={handleCheckHealth}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-full font-semibold shadow-xl hover:bg-slate-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Activity className="w-5 h-5" />
        Kiểm tra kết nối Backend
      </button>
    </div>
  );
};

