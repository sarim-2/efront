import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12 px-4 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
