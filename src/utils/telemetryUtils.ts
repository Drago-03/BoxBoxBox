import { TelemetryResponse, TelemetryDataPoint, TelemetrySession } from '../types/telemetry';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_PATH = '/api/v1';

/**
 * Fetch live telemetry data for a session
 */
export const fetchLiveTelemetry = async (
  sessionId: string,
  driverId?: string
): Promise<TelemetryResponse> => {
  try {
    const url = `${API_BASE_URL}${API_PATH}/telemetry/live/${sessionId}`;
    const params = driverId ? { driver_id: driverId } : {};
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    throw error;
  }
};

/**
 * Fetch user's telemetry sessions
 */
export const fetchTelemetrySessions = async (
  token: string
): Promise<TelemetrySession[]> => {
  try {
    const url = `${API_BASE_URL}${API_PATH}/telemetry/sessions`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching telemetry sessions:', error);
    throw error;
  }
};

/**
 * Process telemetry data for visualization
 */
export const processTelemetryData = (data: TelemetryDataPoint[]): {
  speedData: number[];
  throttleData: number[];
  brakeData: number[];
  timeLabels: string[];
} => {
  // Extract data for charts
  const speedData = data.map(point => point.speed || 0);
  const throttleData = data.map(point => point.throttle || 0);
  const brakeData = data.map(point => point.brake || 0);
  
  // Format timestamps for labels
  const timeLabels = data.map(point => {
    const date = new Date(point.timestamp);
    return `${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  });
  
  return {
    speedData,
    throttleData,
    brakeData,
    timeLabels
  };
};

/**
 * Connect to telemetry WebSocket
 */
export const connectToTelemetryWebSocket = (
  sessionId: string, 
  onMessage: (data: any) => void,
  onError: (error: Event) => void,
  driverId?: string
): WebSocket => {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  const url = `${wsUrl}/api/v1/ws/telemetry/${sessionId}${driverId ? `?driver_id=${driverId}` : ''}`;
  
  const socket = new WebSocket(url);
  
  socket.onopen = () => {
    console.log('WebSocket connected');
    // Send initial ping
    socket.send(JSON.stringify({ type: 'ping' }));
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  socket.onerror = onError;
  
  // Setup ping interval to keep connection alive
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
  
  // Clean up interval on close
  socket.onclose = () => {
    clearInterval(pingInterval);
    console.log('WebSocket disconnected');
  };
  
  return socket;
};

/**
 * Format telemetry values for display
 */
export const formatTelemetryValue = (
  value: number | undefined, 
  type: 'speed' | 'throttle' | 'brake' | 'rpm' | 'gear' | 'tire_life'
): string => {
  if (value === undefined) return 'N/A';
  
  switch (type) {
    case 'speed':
      return `${Math.round(value)} km/h`;
    case 'throttle':
    case 'brake':
    case 'tire_life':
      return `${Math.round(value)}%`;
    case 'rpm':
      return `${Math.round(value)} RPM`;
    case 'gear':
      return value === 0 ? 'N' : value.toString();
    default:
      return value.toString();
  }
}; 