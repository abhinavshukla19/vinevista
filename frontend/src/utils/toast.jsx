import toast, { Toaster } from 'react-hot-toast';

export const ToastRoot = () => (
  <Toaster
    toastOptions={{
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontSize: '15px',
        padding: '14px 18px',
      },
      success: {
        iconTheme: { primary: '#00FFB2', secondary: '#111' },
      },
      error: {
        iconTheme: { primary: '#FF3D00', secondary: '#111' },
      },
    }}
  />
);

export const host = "https://vinevista.onrender.com";

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);


