/**
 * Timeline component for displaying tool calls and actions.
 * Shows user-friendly or technical details based on toggle.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import type { ToolCallDisplay } from '../types';

interface TimelineProps {
  toolCalls: ToolCallDisplay[];
  showTechnical: boolean;
  onToggleTechnical: () => void;
}

const statusIcons: Record<string, string> = {
  pending: '⏳',
  completed: '✓',
  failed: '✗',
};

const statusColors: Record<string, string> = {
  pending: 'border-l-yellow-500 bg-yellow-500/5',
  completed: 'border-l-green-500 bg-green-500/5',
  failed: 'border-l-red-500 bg-red-500/5',
};

export function Timeline({ toolCalls, showTechnical, onToggleTechnical }: TimelineProps) {
  if (toolCalls.length === 0) {
    return (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-sm">Actions will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-medium text-gray-400">Activity</h3>
        <button
          onClick={onToggleTechnical}
          className="text-xs px-2 py-1 rounded bg-dark-elevated hover:bg-dark-border transition-colors"
        >
          {showTechnical ? 'Simple View' : 'Technical View'}
        </button>
      </div>

      {/* Timeline items */}
      <div className="timeline flex-1 overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {toolCalls.map((toolCall, index) => (
            <motion.div
              key={`${toolCall.timestamp}-${index}`}
              className={`timeline-item card p-4 mb-3 border-l-4 ${statusColors[toolCall.status]}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{statusIcons[toolCall.status]}</span>
                  <span className="font-medium text-white">
                    {showTechnical ? toolCall.technical?.tool : toolCall.action}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(toolCall.timestamp), 'HH:mm:ss')}
                </span>
              </div>

              {/* Details */}
              {!showTechnical && toolCall.details && (
                <p className="text-sm text-gray-400">{toolCall.details}</p>
              )}

              {/* Technical details */}
              {showTechnical && toolCall.technical && (
                <div className="mt-2 space-y-2">
                  {/* Parameters */}
                  {toolCall.technical.params && Object.keys(toolCall.technical.params).length > 0 && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Parameters
                      </span>
                      <pre className="mt-1 text-xs bg-dark-bg p-2 rounded overflow-x-auto">
                        {JSON.stringify(toolCall.technical.params, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Result */}
                  {toolCall.technical.result !== undefined && toolCall.technical.result !== null && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Result
                      </span>
                      <pre className="mt-1 text-xs bg-dark-bg p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(toolCall.technical.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Status badge for failed */}
              {toolCall.status === 'failed' && (
                <div className="mt-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                  Action failed - please try again
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Timeline;
