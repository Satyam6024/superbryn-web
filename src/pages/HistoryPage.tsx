/**
 * HistoryPage - Shows conversation history for a user.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { api } from '../services/api';
import type { ConversationSummary } from '../types';

export function HistoryPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [history, setHistory] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Load saved phone and history
  useEffect(() => {
    const savedPhone = localStorage.getItem('bryn_user_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      loadHistory(savedPhone);
    }
  }, []);

  const loadHistory = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.getConversationHistory(phoneNumber, 20);
      setHistory(result.conversations);
    } catch (err) {
      setError('No conversation history found for this phone number.');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      localStorage.setItem('bryn_user_phone', phone);
      loadHistory(phone);
    }
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="p-4 border-b border-dark-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">Conversation History</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Search form */}
        <motion.form
          className="mb-8"
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="label">Look up by phone number</label>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="input flex-1"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!phone || isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </motion.form>

        {/* Error state */}
        {error && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400">{error}</p>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="loading-pulse h-4 w-3/4 mb-3" />
                <div className="loading-pulse h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* History list */}
        {!isLoading && history.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {history.map((conv, index) => (
              <motion.div
                key={index}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Header */}
                <button
                  className="w-full p-4 text-left hover:bg-dark-elevated/50 transition-colors"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white">{conv.summary}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(conv.timestamp), 'MMMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {conv.appointments.booked.length > 0 && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {conv.appointments.booked.length} booked
                        </span>
                      )}
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {expandedIndex === index && (
                  <motion.div
                    className="px-4 pb-4 border-t border-dark-border"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Key points */}
                    {conv.keyPoints.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Key Points</h4>
                        <ul className="space-y-1">
                          {conv.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-accent-primary mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Appointments */}
                    {(conv.appointments.booked.length > 0 ||
                      conv.appointments.modified.length > 0 ||
                      conv.appointments.cancelled.length > 0) && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Appointments</h4>
                        <div className="space-y-2">
                          {conv.appointments.booked.map((apt, i) => (
                            <div
                              key={`booked-${i}`}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-green-500">✓</span>
                              <span className="text-gray-300">
                                Booked: {apt.date} at {apt.time}
                              </span>
                            </div>
                          ))}
                          {conv.appointments.cancelled.map((apt, i) => (
                            <div
                              key={`cancelled-${i}`}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-red-500">✗</span>
                              <span className="text-gray-300">
                                Cancelled: {apt.date} at {apt.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <span>{conv.metrics.turns} exchanges</span>
                      <span>{conv.metrics.toolCalls} actions</span>
                      <span>
                        {Math.floor(conv.metrics.durationSeconds / 60)}:
                        {String(conv.metrics.durationSeconds % 60).padStart(2, '0')} duration
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && !error && history.length === 0 && phone && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
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
            <p className="text-gray-400">No conversations found</p>
            <button
              onClick={() => navigate('/conversation')}
              className="btn btn-primary mt-4"
            >
              Start Your First Conversation
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default HistoryPage;
