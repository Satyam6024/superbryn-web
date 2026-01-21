/**
 * Controls component for call controls.
 * Provides mute, end call, and reset functionality.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConnectionState } from '../types';

interface ControlsProps {
  connectionState: ConnectionState;
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
  onReset: () => void;
}

export function Controls({
  connectionState,
  isMuted,
  onToggleMute,
  onEndCall,
  onReset,
}: ControlsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting' || connectionState === 'reconnecting';

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    setShowResetConfirm(false);
    onReset();
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Mute button */}
        <motion.button
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isMuted
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-dark-elevated hover:bg-dark-border'
          } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onToggleMute}
          disabled={!isConnected}
          whileTap={isConnected ? { scale: 0.95 } : undefined}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </motion.button>

        {/* End call button */}
        <motion.button
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isConnected
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-dark-elevated hover:bg-dark-border'
          }`}
          onClick={onEndCall}
          disabled={isConnecting}
          whileTap={{ scale: 0.95 }}
          title="End call"
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
        </motion.button>

        {/* Reset button */}
        <motion.button
          className={`w-14 h-14 rounded-full flex items-center justify-center bg-dark-elevated hover:bg-dark-border transition-colors ${
            !isConnected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleResetClick}
          disabled={!isConnected}
          whileTap={isConnected ? { scale: 0.95 } : undefined}
          title="Start over"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Reset confirmation dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-dark-surface border border-dark-border rounded-xl p-6 max-w-sm w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Start Over?
              </h3>
              <p className="text-gray-400 mb-6">
                This will reset the current conversation. Your previous appointments and history will still be saved.
              </p>
              <div className="flex gap-3">
                <button
                  className="btn btn-secondary flex-1"
                  onClick={handleResetCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger flex-1"
                  onClick={handleResetConfirm}
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection status indicator */}
      {isConnecting && (
        <motion.div
          className="flex items-center justify-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-spinner w-4 h-4" />
          <span className="text-sm text-gray-400">
            {connectionState === 'reconnecting' ? 'Reconnecting...' : 'Connecting...'}
          </span>
        </motion.div>
      )}
    </>
  );
}

export default Controls;
