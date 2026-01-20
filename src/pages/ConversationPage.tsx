/**
 * ConversationPage - Main voice conversation interface.
 * Split view with avatar and timeline/transcript.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '../context/ConversationContext';
import { useLiveKit } from '../hooks/useLiveKit';
import {
  Avatar,
  Timeline,
  Transcript,
  Summary,
  Controls,
  TextFallback,
} from '../components';

export function ConversationPage() {
  const navigate = useNavigate();
  const { state, toggleTranscript, toggleTechnicalDetails, resetConversation, setSummary } =
    useConversation();
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    localAudioEnabled,
    toggleLocalAudio,
  } = useLiveKit();

  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicPermission();
  }, []);

  // Auto-connect when page loads
  useEffect(() => {
    if (hasMicPermission === true && !isConnected && !isConnecting) {
      connect();
    }
  }, [hasMicPermission, isConnected, isConnecting, connect]);

  // Show summary when conversation ends
  useEffect(() => {
    if (state.summary) {
      setShowSummary(true);
    }
  }, [state.summary]);

  const checkMicPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasMicPermission(result.state === 'granted');

      result.addEventListener('change', () => {
        setHasMicPermission(result.state === 'granted');
      });
    } catch {
      // Permissions API not supported, try to get media
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasMicPermission(true);
      } catch {
        setHasMicPermission(false);
      }
    }
  };

  const handleEndCall = useCallback(() => {
    disconnect();
    if (state.toolCalls.length > 0 || state.messages.length > 0) {
      // Show summary before navigating
      setShowSummary(true);
    } else {
      navigate('/');
    }
  }, [disconnect, navigate, state.toolCalls.length, state.messages.length]);

  const handleReset = useCallback(() => {
    resetConversation();
    connect();
  }, [resetConversation, connect]);

  const handleCloseSummary = useCallback(() => {
    setShowSummary(false);
    setSummary(null);
    navigate('/');
  }, [navigate, setSummary]);

  const handleTextMessage = useCallback((message: string) => {
    // TODO: Send text message to agent via LiveKit data channel
    console.log('Text message:', message);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <header className="p-4 border-b border-dark-border shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="font-medium text-white">Bryn</span>
            </div>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-green-500'
                  : isConnecting
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-500'
              }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected
                ? 'Connected'
                : isConnecting
                ? 'Connecting...'
                : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content - split view */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Left side - Avatar */}
        <motion.div
          className="lg:flex-1 flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex-1 min-h-[300px] lg:min-h-0">
            <Avatar
              state={state.agentState}
              isLoading={isConnecting}
            />
          </div>

          {/* Controls */}
          <div className="mt-6">
            <Controls
              connectionState={state.connectionState}
              isMuted={!localAudioEnabled}
              onToggleMute={toggleLocalAudio}
              onEndCall={handleEndCall}
              onReset={handleReset}
            />
          </div>

          {/* Text fallback when no mic */}
          {hasMicPermission === false && (
            <div className="mt-4">
              <TextFallback
                onSendMessage={handleTextMessage}
                isProcessing={state.agentState === 'thinking'}
                disabled={!isConnected}
              />
            </div>
          )}
        </motion.div>

        {/* Right side - Timeline and Transcript */}
        <motion.div
          className="lg:w-96 flex flex-col gap-4 overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Timeline */}
          <div className="card p-4 flex-1 overflow-hidden">
            <Timeline
              toolCalls={state.toolCalls}
              showTechnical={state.showTechnicalDetails}
              onToggleTechnical={toggleTechnicalDetails}
            />
          </div>

          {/* Transcript */}
          <div className="card p-4 max-h-64 lg:max-h-80 overflow-hidden">
            <Transcript
              messages={state.messages}
              isVisible={state.showTranscript}
              onToggleVisibility={toggleTranscript}
            />
          </div>
        </motion.div>
      </main>

      {/* Error display */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{state.error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary modal */}
      <AnimatePresence>
        {showSummary && state.summary && (
          <Summary summary={state.summary} onClose={handleCloseSummary} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ConversationPage;
