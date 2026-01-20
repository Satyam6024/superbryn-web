/**
 * Transcript component for displaying conversation messages.
 * Shows real-time transcript with user/assistant distinction.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import type { ConversationMessage } from '../types';

interface TranscriptProps {
  messages: ConversationMessage[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function Transcript({ messages, isVisible, onToggleVisibility }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && isVisible) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isVisible]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-medium text-gray-400">Transcript</h3>
        <button
          onClick={onToggleVisibility}
          className="text-xs px-2 py-1 rounded bg-dark-elevated hover:bg-dark-border transition-colors"
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Transcript content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={scrollRef}
            className="transcript flex-1 overflow-y-auto pr-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">Conversation will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={`${message.timestamp}-${index}`}
                      className={`transcript-message p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent-primary/20 ml-8'
                          : 'bg-dark-elevated mr-8'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Role label */}
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium ${
                            message.role === 'user'
                              ? 'text-accent-primary'
                              : 'text-gray-400'
                          }`}
                        >
                          {message.role === 'user' ? 'You' : 'Bryn'}
                        </span>
                        <span className="text-xs text-gray-600">
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-white leading-relaxed">
                        {message.content}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state */}
      {!isVisible && messages.length > 0 && (
        <motion.div
          className="text-xs text-gray-500 bg-dark-elevated px-3 py-2 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {messages.length} message{messages.length !== 1 ? 's' : ''} in transcript
        </motion.div>
      )}
    </div>
  );
}

export default Transcript;
