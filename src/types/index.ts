/**
 * TypeScript type definitions for SuperBryn frontend.
 */

// Tool call types
export type ToolName =
  | 'identify_user'
  | 'fetch_slots'
  | 'book_appointment'
  | 'retrieve_appointments'
  | 'cancel_appointment'
  | 'modify_appointment'
  | 'end_conversation';

export interface ToolCall {
  id: string;
  tool: ToolName;
  params: Record<string, unknown>;
  result: unknown;
  success: boolean;
  duration_ms: number;
  timestamp: string;
}

export interface ToolCallDisplay {
  action: string;
  status: 'pending' | 'completed' | 'failed';
  details: string;
  timestamp: string;
  technical?: {
    tool: string;
    params: Record<string, unknown>;
    result: unknown;
  };
}

// Appointment types
export type AppointmentStatus = 'scheduled' | 'cancelled' | 'completed' | 'no_show';

export interface TimeSlot {
  date: string;
  time: string;
  duration_minutes: number;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  user_phone: string;
  user_name?: string;
  date: string;
  time: string;
  duration_minutes: number;
  purpose?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
}

// User types
export interface User {
  phone_number: string;
  name?: string;
  created_at: string;
  last_interaction?: string;
  preferences: Record<string, unknown>;
  total_appointments: number;
}

// Conversation types
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ConversationSummary {
  summary: string;
  keyPoints: string[];
  appointments: {
    booked: Appointment[];
    modified: Appointment[];
    cancelled: Appointment[];
  };
  preferences: Record<string, unknown>;
  metrics: {
    turns: number;
    toolCalls: number;
    durationSeconds: number;
  };
  timestamp: string;
}

export interface ConversationHistory {
  phone: string;
  conversations: ConversationSummary[];
}

// Connection states
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed';

// Agent states
export type AgentState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking';

// Room/Session types
export interface RoomConfig {
  token: string;
  room_name: string;
  participant_name: string;
  user_timezone: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface TokenResponse {
  token: string;
  room_name: string;
  participant_name: string;
  user_timezone: string;
}

export interface AdminAuthResponse {
  authenticated: boolean;
}

export interface AdminStatsResponse {
  total_appointments: number;
  stats: {
    total: number;
  };
  timestamp: string;
}

export interface AppointmentsListResponse {
  appointments: Appointment[];
  total: number;
  limit: number;
  offset: number;
}

// Component prop types
export interface AvatarProps {
  streamUrl?: string;
  state: AgentState;
  isLoading?: boolean;
}

export interface TimelineProps {
  toolCalls: ToolCallDisplay[];
  showTechnical: boolean;
  onToggleTechnical: () => void;
}

export interface TranscriptProps {
  messages: ConversationMessage[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export interface SummaryProps {
  summary: ConversationSummary;
  onClose: () => void;
}

// Event types
export interface LiveKitEvents {
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: Error) => void;
  onToolCall: (toolCall: ToolCallDisplay) => void;
  onTranscript: (message: ConversationMessage) => void;
  onAgentStateChange: (state: AgentState) => void;
}
