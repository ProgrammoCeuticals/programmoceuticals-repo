import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

type Variant = 'error' | 'success' | 'info';

interface Props {
  variant: Variant;
  message: string;
}

const config: Record<Variant, { icon: React.ReactNode; classes: string }> = {
  error: { icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />, classes: 'bg-red-50 border-red-200 text-red-700' },
  success: { icon: <CheckCircle className="w-4 h-4 flex-shrink-0" />, classes: 'bg-green-50 border-green-200 text-green-700' },
  info: { icon: <Info className="w-4 h-4 flex-shrink-0" />, classes: 'bg-blue-50 border-blue-200 text-blue-700' },
};

export default function StatusBanner({ variant, message }: Props) {
  const { icon, classes } = config[variant];
  return (
    <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm mb-4 ${classes}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
}
