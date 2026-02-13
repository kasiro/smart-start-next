import React from 'react';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-700 rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Подтверждение действия</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {message}
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onCancel}
            >
              Отмена
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onConfirm}
            >
              Да, уверен
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
