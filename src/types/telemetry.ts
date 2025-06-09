// Interfaces for telemetry data

export interface TelemetryDataPoint {
  timestamp: string;
  speed?: number;
  throttle?: number;
  brake?: number;
  gear?: number;
  rpm?: number;
  drs?: number;
  position_x?: number;
  position_y?: number;
  position_z?: number;
  tire_compound?: string;
  tire_life?: number;
  sector?: number;
  lap?: number;
}

export interface TelemetryResponse {
  session_id: string;
  driver_id?: string;
  data: TelemetryDataPoint[];
  lap_count?: number;
  current_lap?: number;
  last_update: string;
}

export interface TelemetrySessionCreate {
  session_type: string;
  circuit_id?: number;
  race_id?: number;
  session_date?: string;
  notes?: string;
}

export interface TelemetrySession {
  id: number;
  user_id: number;
  session_type: string;
  circuit_id?: number;
  race_id?: number;
  session_date: string;
  notes?: string;
  created_at: string;
}

// Race engineer message types
export type MessagePriority = 'low' | 'medium' | 'high' | 'critical';
export type MessageType = 'strategy' | 'warning' | 'info' | 'response';

export interface EngineerMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  priority: MessagePriority;
  audioEnabled: boolean;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

export interface TelemetryUpdate extends WebSocketMessage {
  type: 'telemetry_update';
  data: TelemetryResponse;
}

export interface BroadcastMessage extends WebSocketMessage {
  type: 'broadcast';
  data: {
    message: string;
    sender?: {
      id: number;
      username: string;
    };
  };
} 