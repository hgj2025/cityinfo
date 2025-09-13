
import { ToastProps } from '../../types';

const Toast = ({ message, show }: ToastProps) => {
  if (!show) return null;

  return (
    <div id="collect-toast" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
      <span id="collect-toast-message">{message}</span>
    </div>
  );
};

export default Toast;