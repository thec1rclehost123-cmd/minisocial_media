import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-8 right-8 z-[200] animate-reveal">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span className="text-sm font-bold">{message}</span>
                <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-all">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
