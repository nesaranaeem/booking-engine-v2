// components/ui/use-toast.js
import * as React from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  Toaster,
} from "./toast.jsx";

const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProviderComponent");
  }
  return context;
};

export const ToastProviderComponent = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = ({ title, description, variant = "default" }) => {
    const id = Date.now();
    // Check if a similar toast already exists
    const existingToast = toasts.find(
      toast => toast.title === title && toast.description === description
    );
    
    if (!existingToast) {
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      // Automatically remove toast after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => {
      // Only remove if toast still exists to prevent duplicate removals
      if (prev.some((toast) => toast.id === id)) {
        return prev.filter((toast) => toast.id !== id);
      }
      return prev;
    });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastProvider swipeDirection="right">
        <ToastViewport />
        {toasts.map(({ id, title, description, variant }) => (
          <Toast
            key={id}
            variant={variant}
            onOpenChange={(open) => !open && removeToast(id)}
          >
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  );
};
