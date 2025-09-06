"use client"
import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toaster';

interface ToastContextType {
  addToast: (msg: string, success?: boolean) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; message: string; success: boolean }[]>([]);

  function addToast(msg: string, success: boolean = true) {
    console.log('Toast triggered:', msg, success); // Debug log
    setToasts((prev) => [...prev, { id: Date.now(), message: msg, success }]);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
        {toasts.map((t) => (
          <Toast 
            key={t.id} 
            message={t.message} 
            success={t.success}
            onClose={() => removeToast(t.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}