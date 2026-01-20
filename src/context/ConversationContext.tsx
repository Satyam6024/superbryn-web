import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  ConnectionState,
  AgentState,
  ToolCallDisplay,
  ConversationMessage,
  ConversationSummary,
  RoomConfig,
} from '../types';

// State type
interface ConversationState {
  connectionState: ConnectionState;
  agentState: AgentState;
  roomConfig: RoomConfig | null;
  toolCalls: ToolCallDisplay[];
  messages: ConversationMessage[];
  summary: ConversationSummary | null;
  showTranscript: boolean;
  showTechnicalDetails: boolean;
  userPhone: string | null;
  isIdentified: boolean;
  error: string | null;
}

// Action types
type ConversationAction =
  | { type: 'SET_CONNECTION_STATE'; payload: ConnectionState }
  | { type: 'SET_AGENT_STATE'; payload: AgentState }
  | { type: 'SET_ROOM_CONFIG'; payload: RoomConfig | null }
  | { type: 'ADD_TOOL_CALL'; payload: ToolCallDisplay }
  | { type: 'UPDATE_TOOL_CALL'; payload: { index: number; data: Partial<ToolCallDisplay> } }
  | { type: 'ADD_MESSAGE'; payload: ConversationMessage }
  | { type: 'SET_SUMMARY'; payload: ConversationSummary | null }
  | { type: 'TOGGLE_TRANSCRIPT' }
  | { type: 'TOGGLE_TECHNICAL_DETAILS' }
  | { type: 'SET_USER_PHONE'; payload: string }
  | { type: 'SET_IDENTIFIED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CONVERSATION' };

// Initial state
const initialState: ConversationState = {
  connectionState: 'disconnected',
  agentState: 'idle',
  roomConfig: null,
  toolCalls: [],
  messages: [],
  summary: null,
  showTranscript: false,
  showTechnicalDetails: false,
  userPhone: null,
  isIdentified: false,
  error: null,
};

// Reducer
function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case 'SET_CONNECTION_STATE':
      return { ...state, connectionState: action.payload };

    case 'SET_AGENT_STATE':
      return { ...state, agentState: action.payload };

    case 'SET_ROOM_CONFIG':
      return { ...state, roomConfig: action.payload };

    case 'ADD_TOOL_CALL':
      return { ...state, toolCalls: [...state.toolCalls, action.payload] };

    case 'UPDATE_TOOL_CALL':
      return {
        ...state,
        toolCalls: state.toolCalls.map((tc, i) =>
          i === action.payload.index ? { ...tc, ...action.payload.data } : tc
        ),
      };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };

    case 'TOGGLE_TRANSCRIPT':
      return { ...state, showTranscript: !state.showTranscript };

    case 'TOGGLE_TECHNICAL_DETAILS':
      return { ...state, showTechnicalDetails: !state.showTechnicalDetails };

    case 'SET_USER_PHONE':
      return { ...state, userPhone: action.payload };

    case 'SET_IDENTIFIED':
      return { ...state, isIdentified: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'RESET_CONVERSATION':
      return {
        ...initialState,
        connectionState: state.connectionState,
      };

    default:
      return state;
  }
}

// Context type
interface ConversationContextType {
  state: ConversationState;
  setConnectionState: (state: ConnectionState) => void;
  setAgentState: (state: AgentState) => void;
  setRoomConfig: (config: RoomConfig | null) => void;
  addToolCall: (toolCall: ToolCallDisplay) => void;
  updateToolCall: (index: number, data: Partial<ToolCallDisplay>) => void;
  addMessage: (message: ConversationMessage) => void;
  setSummary: (summary: ConversationSummary | null) => void;
  toggleTranscript: () => void;
  toggleTechnicalDetails: () => void;
  setUserPhone: (phone: string) => void;
  setIdentified: (identified: boolean) => void;
  setError: (error: string | null) => void;
  resetConversation: () => void;
}

// Create context
const ConversationContext = createContext<ConversationContextType | null>(null);

// Provider component
export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  const setConnectionState = useCallback((connectionState: ConnectionState) => {
    dispatch({ type: 'SET_CONNECTION_STATE', payload: connectionState });
  }, []);

  const setAgentState = useCallback((agentState: AgentState) => {
    dispatch({ type: 'SET_AGENT_STATE', payload: agentState });
  }, []);

  const setRoomConfig = useCallback((config: RoomConfig | null) => {
    dispatch({ type: 'SET_ROOM_CONFIG', payload: config });
  }, []);

  const addToolCall = useCallback((toolCall: ToolCallDisplay) => {
    dispatch({ type: 'ADD_TOOL_CALL', payload: toolCall });
  }, []);

  const updateToolCall = useCallback((index: number, data: Partial<ToolCallDisplay>) => {
    dispatch({ type: 'UPDATE_TOOL_CALL', payload: { index, data } });
  }, []);

  const addMessage = useCallback((message: ConversationMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const setSummary = useCallback((summary: ConversationSummary | null) => {
    dispatch({ type: 'SET_SUMMARY', payload: summary });
  }, []);

  const toggleTranscript = useCallback(() => {
    dispatch({ type: 'TOGGLE_TRANSCRIPT' });
  }, []);

  const toggleTechnicalDetails = useCallback(() => {
    dispatch({ type: 'TOGGLE_TECHNICAL_DETAILS' });
  }, []);

  const setUserPhone = useCallback((phone: string) => {
    dispatch({ type: 'SET_USER_PHONE', payload: phone });
  }, []);

  const setIdentified = useCallback((identified: boolean) => {
    dispatch({ type: 'SET_IDENTIFIED', payload: identified });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const resetConversation = useCallback(() => {
    dispatch({ type: 'RESET_CONVERSATION' });
  }, []);

  const value: ConversationContextType = {
    state,
    setConnectionState,
    setAgentState,
    setRoomConfig,
    addToolCall,
    updateToolCall,
    addMessage,
    setSummary,
    toggleTranscript,
    toggleTechnicalDetails,
    setUserPhone,
    setIdentified,
    setError,
    resetConversation,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

// Hook to use context
export function useConversation(): ConversationContextType {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
}
