import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TelemetryResponse, TelemetryDataPoint, TelemetrySession } from '../types/telemetry';
import { fetchLiveTelemetry, connectToTelemetryWebSocket } from '../utils/telemetryUtils';

interface TelemetryContextProps {
  telemetryData: TelemetryResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedDriver: string | null;
  setSelectedDriver: (driverId: string | null) => void;
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
  availableSessions: TelemetrySession[];
  refreshTelemetry: () => Promise<void>;
  isLiveMode: boolean;
  setLiveMode: (isLive: boolean) => void;
}

const TelemetryContext = createContext<TelemetryContextProps | undefined>(undefined);

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

interface TelemetryProviderProps {
  children: ReactNode;
}

export const TelemetryProvider: React.FC<TelemetryProviderProps> = ({ children }) => {
  const [telemetryData, setTelemetryData] = useState<TelemetryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [availableSessions, setAvailableSessions] = useState<TelemetrySession[]>([]);
  const [isLiveMode, setLiveMode] = useState(true);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // Load telemetry data when session or driver changes
  useEffect(() => {
    if (!sessionId) return;
    
    const loadTelemetryData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchLiveTelemetry(sessionId, selectedDriver || undefined);
        setTelemetryData(data);
      } catch (err) {
        console.error('Failed to fetch telemetry data:', err);
        setError('Failed to load telemetry data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTelemetryData();
  }, [sessionId, selectedDriver]);

  // Setup WebSocket for live telemetry if in live mode
  useEffect(() => {
    if (!sessionId || !isLiveMode) {
      if (websocket) {
        websocket.close();
        setWebsocket(null);
      }
      return;
    }
    
    const handleMessage = (data: any) => {
      if (data.type === 'telemetry_update') {
        setTelemetryData(data.data);
      }
    };
    
    const handleError = (event: Event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket connection error. Live updates disabled.');
      setLiveMode(false);
    };
    
    const socket = connectToTelemetryWebSocket(
      sessionId, 
      handleMessage,
      handleError,
      selectedDriver || undefined
    );
    
    setWebsocket(socket);
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [sessionId, selectedDriver, isLiveMode]);

  // Manually refresh telemetry data
  const refreshTelemetry = async () => {
    if (!sessionId) {
      setError('No session selected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLiveTelemetry(sessionId, selectedDriver || undefined);
      setTelemetryData(data);
    } catch (err) {
      console.error('Failed to refresh telemetry data:', err);
      setError('Failed to refresh telemetry data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load available sessions (in a real app, this would come from the API)
  useEffect(() => {
    // Mock data for available sessions
    setAvailableSessions([
      {
        id: 1,
        user_id: 1,
        session_type: 'Race',
        circuit_id: 1,
        race_id: 1,
        session_date: new Date().toISOString(),
        notes: 'Monaco Grand Prix',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        user_id: 1,
        session_type: 'Qualifying',
        circuit_id: 2,
        race_id: 2,
        session_date: new Date().toISOString(),
        notes: 'Monza Qualifying',
        created_at: new Date().toISOString()
      }
    ]);
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        telemetryData,
        isLoading,
        error,
        selectedDriver,
        setSelectedDriver,
        sessionId,
        setSessionId,
        availableSessions,
        refreshTelemetry,
        isLiveMode,
        setLiveMode
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}; 