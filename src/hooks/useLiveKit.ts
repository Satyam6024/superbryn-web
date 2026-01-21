/**
 * Custom hook for LiveKit room management.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Room,
  RoomEvent,
  ConnectionState as LKConnectionState,
  RemoteParticipant,
} from 'livekit-client';
import { useConversation } from '../context/ConversationContext';
import { api } from '../services/api';
import type { ConnectionState, AgentState, ToolCallDisplay, ConversationMessage } from '../types';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || '';

interface UseLiveKitReturn {
  room: Room | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  localAudioEnabled: boolean;
  toggleLocalAudio: () => void;
}

export function useLiveKit(): UseLiveKitReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const {
    state,
    setConnectionState,
    setAgentState,
    setRoomConfig,
    addToolCall,
    addMessage,
    setSummary,
    setError,
  } = useConversation();

  // Map LiveKit connection state to our state
  const mapConnectionState = useCallback((lkState: LKConnectionState): ConnectionState => {
    switch (lkState) {
      case LKConnectionState.Connected:
        return 'connected';
      case LKConnectionState.Connecting:
        return 'connecting';
      case LKConnectionState.Reconnecting:
        return 'reconnecting';
      case LKConnectionState.Disconnected:
        return 'disconnected';
      default:
        return 'disconnected';
    }
  }, []);

  // Handle data messages from agent
  const handleDataReceived = useCallback(
    (payload: Uint8Array, _participant?: RemoteParticipant) => {
      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload));

        switch (data.type) {
          case 'tool_call':
            addToolCall(data.payload as ToolCallDisplay);
            break;

          case 'transcript':
            addMessage(data.payload as ConversationMessage);
            break;

          case 'agent_state':
            setAgentState(data.payload as AgentState);
            break;

          case 'summary':
            setSummary(data.payload);
            break;

          case 'error':
            setError(data.payload.message);
            break;

          default:
            console.log('Unknown data type:', data.type);
        }
      } catch (err) {
        console.error('Error parsing data message:', err);
      }
    },
    [addToolCall, addMessage, setAgentState, setSummary, setError]
  );

  // Connect to room
  const connect = useCallback(async () => {
    if (isConnecting || state.connectionState === 'connected') {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Get token from backend
      const tokenResponse = await api.getToken();

      // Create room instance
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event handlers
      newRoom.on(RoomEvent.ConnectionStateChanged, (lkState) => {
        const mappedState = mapConnectionState(lkState);
        setConnectionState(mappedState);

        if (lkState === LKConnectionState.Disconnected) {
          // Attempt reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            setTimeout(() => connect(), 2000 * reconnectAttempts.current);
          } else {
            setError('Connection lost. Please refresh to try again.');
          }
        } else if (lkState === LKConnectionState.Connected) {
          reconnectAttempts.current = 0;
        }
      });

      newRoom.on(RoomEvent.DataReceived, handleDataReceived);

      newRoom.on(RoomEvent.Disconnected, () => {
        setConnectionState('disconnected');
        setAgentState('idle');
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log('Participant connected:', participant.identity);
      });

      // Connect to the room
      await newRoom.connect(LIVEKIT_URL, tokenResponse.token);

      // Enable local audio
      await newRoom.localParticipant.setMicrophoneEnabled(true);

      setRoom(newRoom);
      setRoomConfig(tokenResponse);
      setConnectionState('connected');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setConnectionState('failed');
    } finally {
      setIsConnecting(false);
    }
  }, [
    isConnecting,
    state.connectionState,
    mapConnectionState,
    handleDataReceived,
    setConnectionState,
    setAgentState,
    setRoomConfig,
    setError,
  ]);

  // Disconnect from room
  const disconnect = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setRoomConfig(null);
      setConnectionState('disconnected');
      setAgentState('idle');
    }
  }, [room, setRoomConfig, setConnectionState, setAgentState]);

  // Toggle local audio
  const toggleLocalAudio = useCallback(async () => {
    if (room?.localParticipant) {
      const newState = !localAudioEnabled;
      await room.localParticipant.setMicrophoneEnabled(newState);
      setLocalAudioEnabled(newState);
    }
  }, [room, localAudioEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return {
    room,
    connect,
    disconnect,
    isConnected: state.connectionState === 'connected',
    isConnecting,
    error: state.error,
    localAudioEnabled,
    toggleLocalAudio,
  };
}
