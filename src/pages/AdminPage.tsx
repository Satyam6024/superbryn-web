/**
 * AdminPage - Password-protected admin panel.
 * Shows all appointments and basic stats.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { api } from '../services/api';
import type { Appointment, AdminStatsResponse } from '../types';

export function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Check for saved auth
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      api.setAdminPassword(savedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, page]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      const result = await api.adminAuth(password);
      if (result.authenticated) {
        sessionStorage.setItem('admin_password', password);
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid password');
      }
    } catch (err) {
      setAuthError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    api.clearAdminPassword();
    setIsAuthenticated(false);
    setPassword('');
    setAppointments([]);
    setStats(null);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appointmentsResult, statsResult] = await Promise.all([
        api.getAppointments(limit, page * limit),
        api.getAdminStats(),
      ]);
      setAppointments(appointmentsResult.appointments);
      setTotal(appointmentsResult.total);
      setStats(statsResult);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <motion.div
          className="card p-8 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-red-400 text-sm mb-4">{authError}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!password || isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white mt-4 w-full text-center"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="p-4 border-b border-dark-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        {stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card p-6">
              <p className="text-3xl font-bold text-accent-primary">
                {stats.total_appointments}
              </p>
              <p className="text-sm text-gray-400 mt-1">Total Appointments</p>
            </div>
            <div className="card p-6">
              <p className="text-3xl font-bold text-green-500">
                {appointments.filter((a) => a.status === 'scheduled').length}
              </p>
              <p className="text-sm text-gray-400 mt-1">Scheduled</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-500">
                Last updated: {format(new Date(stats.timestamp), 'h:mm a')}
              </p>
              <button
                onClick={loadData}
                className="btn btn-secondary mt-2 text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Appointments table */}
        <motion.div
          className="card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-4 border-b border-dark-border">
            <h2 className="text-lg font-medium text-white">All Appointments</h2>
          </div>

          {isLoading && appointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="loading-spinner mx-auto mb-4" />
              <p className="text-gray-400">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No appointments found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-elevated">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-dark-elevated/50">
                        <td className="px-4 py-3">
                          <p className="text-white">{apt.date}</p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white">{apt.user_name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{apt.user_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {apt.purpose || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {format(new Date(apt.created_at), 'MMM d, h:mm a')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > limit && (
                <div className="p-4 border-t border-dark-border flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Showing {page * limit + 1}-{Math.min((page + 1) * limit, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="btn btn-secondary text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={(page + 1) * limit >= total}
                      className="btn btn-secondary text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default AdminPage;
