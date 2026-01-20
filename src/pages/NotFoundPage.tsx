/**
 * NotFoundPage - 404 error page.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <span className="text-4xl font-bold text-white">?</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">
          Oops! This page doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary px-6 py-3"
        >
          Go Home
        </button>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
