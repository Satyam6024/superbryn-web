/**
 * Avatar component for displaying Beyond Presence avatar.
 * Shows avatar video stream with state indicators.
 */

import { motion } from 'framer-motion';
import type { AgentState } from '../types';

interface AvatarProps {
  streamUrl?: string;
  state: AgentState;
  isLoading?: boolean;
}

const stateLabels: Record<AgentState, string> = {
  idle: 'Ready',
  listening: 'Listening...',
  thinking: 'Processing...',
  speaking: 'Speaking...',
};

const stateColors: Record<AgentState, string> = {
  idle: 'bg-gray-500',
  listening: 'bg-green-500',
  thinking: 'bg-yellow-500',
  speaking: 'bg-blue-500',
};

export function Avatar({ streamUrl, state, isLoading }: AvatarProps) {
  return (
    <div className="avatar-container relative w-full h-full min-h-[300px] lg:min-h-[400px]">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-surface">
          <div className="flex flex-col items-center gap-4">
            <div className="loading-spinner w-12 h-12" />
            <p className="text-gray-400">Loading avatar...</p>
          </div>
        </div>
      )}

      {/* Avatar video or placeholder */}
      {streamUrl ? (
        <video
          src={streamUrl}
          className="avatar-video"
          autoPlay
          playsInline
          muted={false}
        />
      ) : (
        <div className="avatar-placeholder">
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Placeholder avatar circle */}
            <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-4xl lg:text-6xl font-bold text-white">B</span>
            </div>

            {/* Animated ring for speaking/listening states */}
            {(state === 'speaking' || state === 'listening') && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-accent-primary"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: state === 'speaking' ? 0.5 : 1.5,
                  repeat: Infinity,
                }}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* State indicator */}
      <motion.div
        className="state-indicator"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={`state-dot ${stateColors[state]} ${state}`}
          animate={{
            scale: state === 'idle' ? 1 : [1, 1.2, 1],
          }}
          transition={{
            duration: state === 'speaking' ? 0.3 : 0.8,
            repeat: state === 'idle' ? 0 : Infinity,
          }}
        />
        <span className="text-sm text-white">{stateLabels[state]}</span>
      </motion.div>
    </div>
  );
}

export default Avatar;
