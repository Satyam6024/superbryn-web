/**
 * Summary component for displaying end-of-call summary.
 * Shows key points, appointments, and metrics.
 */

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { ConversationSummary } from '../types';

interface SummaryProps {
  summary: ConversationSummary;
  onClose: () => void;
}

export function Summary({ summary, onClose }: SummaryProps) {
  const hasAppointments =
    summary.appointments.booked.length > 0 ||
    summary.appointments.modified.length > 0 ||
    summary.appointments.cancelled.length > 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-dark-surface border border-dark-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Call Summary</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {format(new Date(summary.timestamp), 'MMMM d, yyyy • h:mm a')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Summary text */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
              Overview
            </h3>
            <p className="text-white">{summary.summary}</p>
          </div>

          {/* Key points */}
          {summary.keyPoints.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                Key Points
              </h3>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-white">
                    <span className="text-accent-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Appointments */}
          {hasAppointments && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                Appointments
              </h3>
              <div className="space-y-3">
                {/* Booked */}
                {summary.appointments.booked.map((apt, index) => (
                  <div
                    key={`booked-${index}`}
                    className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3"
                  >
                    <span className="text-green-500">✓</span>
                    <div>
                      <p className="text-white font-medium">
                        Booked: {apt.date} at {apt.time}
                      </p>
                      {apt.purpose && (
                        <p className="text-sm text-gray-400">{apt.purpose}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Modified */}
                {summary.appointments.modified.map((apt, index) => (
                  <div
                    key={`modified-${index}`}
                    className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3"
                  >
                    <span className="text-yellow-500">↻</span>
                    <div>
                      <p className="text-white font-medium">
                        Modified: {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Cancelled */}
                {summary.appointments.cancelled.map((apt, index) => (
                  <div
                    key={`cancelled-${index}`}
                    className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
                  >
                    <span className="text-red-500">✗</span>
                    <div>
                      <p className="text-white font-medium">
                        Cancelled: {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="flex items-center gap-6 pt-4 border-t border-dark-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-primary">
                {summary.metrics.turns}
              </p>
              <p className="text-xs text-gray-400">Exchanges</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-primary">
                {summary.metrics.toolCalls}
              </p>
              <p className="text-xs text-gray-400">Actions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-primary">
                {Math.floor(summary.metrics.durationSeconds / 60)}:{String(summary.metrics.durationSeconds % 60).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-400">Duration</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dark-border">
          <button
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Close Summary
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Summary;
