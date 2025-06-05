'use client';

import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

import { useToastStore } from '@/shared/model/toastStore';

const iconMap = {
  default: <Info size={20} />,
  success: <CheckCircle size={20} className="text-green-500" />,
  error: <XCircle size={20} className="text-red-500" />,
  warning: <AlertTriangle size={20} className="text-yellow-500" />,
};

export function ToastContainer() {
  const { toast } = useToastStore();

  if (!toast) return null;

  const positionClasses = toast.position === 'top' ? 'top-4' : 'bottom-4';

  return (
    <div
      className={`fixed ${positionClasses} left-1/2 transform -translate-x-1/2 z-50 transition ease-out duration-300 animate-slideInFade`}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-md shadow-md bg-gray-800 text-white">
        {iconMap[toast.type]}
        <span className="text-sm">{toast.message}</span>
      </div>
    </div>
  );
}
