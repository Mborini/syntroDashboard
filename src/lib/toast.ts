import toast, { ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  duration: 3000,
  style: {
    fontSize: '14px',
    borderRadius: '8px',
    padding: '12px 16px',
  },
};

export const Toast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, ...options }),

  info: (message: string, options?: ToastOptions) =>
    toast(message, { ...defaultOptions, style: { ...defaultOptions.style, background: '#2196f3', color: 'white' }, ...options }),

  warning: (message: string, options?: ToastOptions) =>
    toast(message, { ...defaultOptions, style: { ...defaultOptions.style, background: '#ff9800', color: 'white' }, ...options }),
};
