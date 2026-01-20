/**
 * TextFallback component for text-based chat when mic is unavailable.
 * Provides a text input alternative to voice interaction.
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextFallbackProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  disabled: boolean;
}

export function TextFallback({ onSendMessage, isProcessing, disabled }: TextFallbackProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="bg-dark-surface border border-dark-border rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Notice */}
      <div className="flex items-center gap-2 mb-4 text-yellow-500 text-sm">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Microphone not available. Using text chat instead.</span>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="input flex-1"
          disabled={isProcessing || disabled}
        />
        <button
          type="submit"
          className="btn btn-primary px-6"
          disabled={!message.trim() || isProcessing || disabled}
        >
          {isProcessing ? (
            <div className="loading-spinner w-5 h-5" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      {/* Suggestions */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Show available slots',
            'Check my appointments',
            'Book an appointment',
            'Cancel appointment',
          ].map((suggestion) => (
            <button
              key={suggestion}
              className="text-xs px-3 py-1.5 rounded-full bg-dark-elevated hover:bg-dark-border transition-colors text-gray-300"
              onClick={() => setMessage(suggestion)}
              disabled={isProcessing || disabled}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default TextFallback;
