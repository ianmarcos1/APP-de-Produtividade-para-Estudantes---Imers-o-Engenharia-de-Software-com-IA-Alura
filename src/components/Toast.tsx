import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-xl ring-1 ring-slate-900/5 animate-in slide-in-from-bottom-5 duration-200"
    >
      {toast.type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
      ) : (
        <Info className="h-5 w-5 text-indigo-600 shrink-0" />
      )}
      <span className="font-medium text-slate-800">{toast.text}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Dispensar aviso"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
