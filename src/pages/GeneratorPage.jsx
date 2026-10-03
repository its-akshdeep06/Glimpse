import React from 'react';
import { ToastProvider } from '@/components/app/Toast';
import Workspace from '@/components/app/Workspace';

export default function GeneratorPage() {
  return (
    <ToastProvider>
      <Workspace />
    </ToastProvider>
  );
}