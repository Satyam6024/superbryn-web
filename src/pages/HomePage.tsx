/**
 * HomePage - Landing page with start conversation button.
 * Shows history for returning users.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { api } from '../services/api';
import type { ConversationSummary } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [history, setHistory] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Check for saved phone and load history
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
      const result = await api.getConversationHistory(phoneNumber);
      setHistory(result.conversations);
    } catch (err) {
      // Silently fail - user might not have history
      console.log('No history found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversation = () => {
    if (phone) {
      localStorage.setItem('bryn_user_phone', phone);
    }
    navigate('/conversation');
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      localStorage.setItem('bryn_user_phone', phone);
      await loadHistory(phone);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-dark-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="text-xl font-semibold text-white">Bryn</span>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Hero */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-4xl font-bold text-white">B</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hi, I'm Bryn
            </h1>
            <p className="text-lg text-gray-400 max-w-md mx-auto">
              Your AI appointment assistant. I can help you book, check, or manage your appointments through natural conversation.
            </p>
          </motion.div>

          {/* Phone input for returning users */}
          <motion.form
            className="mb-8"
            onSubmit={handlePhoneSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="label text-center block mb-2">
              Have we met before? Enter your phone number to see your history
            </label>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="input flex-1"
              />
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={!phone || isLoading}
              >
                {isLoading ? 'Loading...' : 'Look Up'}
              </button>
            </div>
          </motion.form>

          {/* History section */}
          {history.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-medium text-white mb-4">
                Your Recent Conversations
              </h2>
              <div className="space-y-3">
                {history.slice(0, 3).map((conv, index) => (
                  <div
                    key={index}
                    className="card p-4 hover:border-accent-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white">{conv.summary}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(conv.timestamp), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      {conv.appointments.booked.length > 0 && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {conv.appointments.booked.length} booked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {history.length > 3 && (
                <button
                  onClick={() => navigate('/history')}
                  className="text-sm text-accent-primary hover:underline mt-3"
                >
                  View all history →
                </button>
              )}
            </motion.div>
          )}

          {/* Start button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleStartConversation}
              className="btn btn-primary px-8 py-4 text-lg"
            >
              Start Conversation
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Microphone access required for voice chat
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-dark-border text-center text-sm text-gray-500">
        Powered by AI • Built with LiveKit, Claude, and Beyond Presence
      </footer>
    </div>
  );
}

export default HomePage;
