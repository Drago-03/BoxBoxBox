import { useState, useEffect, useCallback } from 'react';
import { RealTimeDataConnection } from '../utils/api';

interface UseRealTimeDataOptions {
  enabled: boolean;
  onError?: (error: any) => void;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = { enabled: true }) => {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<any>(null);
  const [connection, setConnection] = useState<RealTimeDataConnection | null>(null);

  const handleData = useCallback((newData: any) => {
    setData(newData);
    setError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    setError(error);
    setIsConnected(false);
    if (options.onError) {
      options.onError(error);
    }
  }, [options]);

  useEffect(() => {
    if (!options.enabled) return;

    const conn = new RealTimeDataConnection(handleData, handleError);
    setConnection(conn);
    conn.connect();

    return () => {
      conn.disconnect();
      setConnection(null);
      setIsConnected(false);
    };
  }, [options.enabled, handleData, handleError]);

  const sendMessage = useCallback((message: any) => {
    if (connection) {
      connection.send(message);
    }
  }, [connection]);

  return {
    data,
    isConnected,
    error,
    sendMessage
  };
};

// Hook for telemetry data
export const useTelemetryData = (driverCode: string, enabled: boolean = true) => {
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { data, isConnected, error } = useRealTimeData({
    enabled,
    onError: (error) => console.error('Telemetry data error:', error)
  });

  useEffect(() => {
    if (data && data.type === 'telemetry' && data.driver === driverCode) {
      setTelemetryData(prev => {
        const newData = [...prev, data.payload];
        // Keep only last 100 data points
        return newData.slice(-100);
      });
      setLastUpdate(new Date());
    }
  }, [data, driverCode]);

  return {
    telemetryData,
    lastUpdate,
    isConnected,
    error
  };
};

// Hook for race session data
export const useSessionData = (enabled: boolean = true) => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);

  const { data, isConnected, error } = useRealTimeData({
    enabled,
    onError: (error) => console.error('Session data error:', error)
  });

  useEffect(() => {
    if (data) {
      if (data.type === 'session_update') {
        setSessionData(data.payload);
      } else if (data.type === 'timing_update') {
        setDrivers(data.payload.drivers || []);
      }
    }
  }, [data]);

  return {
    sessionData,
    drivers,
    isConnected,
    error
  };
};