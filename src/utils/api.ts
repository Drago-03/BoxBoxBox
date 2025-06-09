// API utilities for BoxBoxBox platform
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// FastF1 Integration
export interface TelemetryData {
  lap: number;
  time: string;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
  drs: boolean;
  ers_deployment: number;
  tire_temp: number[];
  engine_temp: number;
  fuel_level: number;
}

export interface SessionData {
  session_type: string;
  track: string;
  weather: {
    air_temp: number;
    track_temp: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    rain_probability: number;
  };
  drivers: Array<{
    driver_code: string;
    name: string;
    team: string;
    position: number;
    lap_time: string;
    gap: string;
  }>;
}

// API Functions
export const fetchLiveTelemetry = async (driverCode: string): Promise<TelemetryData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/telemetry/live/${driverCode}`);
    if (!response.ok) throw new Error('Failed to fetch telemetry');
    return await response.json();
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    // Return mock data for development
    return generateMockTelemetry();
  }
};

export const fetchSessionData = async (): Promise<SessionData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/current`);
    if (!response.ok) throw new Error('Failed to fetch session data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching session data:', error);
    // Return mock data for development
    return generateMockSessionData();
  }
};

export const submitRaceEngineerQuery = async (query: string, context: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rag/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        context,
        mode: 'race_engineer'
      })
    });
    
    if (!response.ok) throw new Error('Failed to process query');
    return await response.json();
  } catch (error) {
    console.error('Error processing race engineer query:', error);
    // Return mock response for development
    return {
      response: "I'm analyzing the current race situation. Based on telemetry data, I recommend maintaining current pace and monitoring tire degradation.",
      confidence: 0.85,
      sources: ['telemetry_analysis', 'strategy_database']
    };
  }
};

export const predictPitStopTime = async (params: {
  driver: string;
  team: string;
  track: string;
  weather: string;
  tire_compound: string;
  current_lap: number;
  track_temp: number;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/pitstop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) throw new Error('Failed to predict pit stop time');
    return await response.json();
  } catch (error) {
    console.error('Error predicting pit stop time:', error);
    // Return mock prediction for development
    return {
      predicted_time: 2.3 + Math.random() * 0.8,
      confidence: 85 + Math.random() * 10,
      factors: {
        team_performance: Math.random() > 0.5 ? 'positive' : 'negative',
        track_difficulty: Math.random() > 0.5 ? 'high' : 'medium',
        weather_impact: params.weather === 'wet' ? 'high' : 'low'
      }
    };
  }
};

export const simulateRaceStrategy = async (strategy: {
  starting_position: number;
  starting_tire: string;
  pit_stops: number[];
  tire_sequence: string[];
  aggressiveness: string;
  weather_forecast: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate/strategy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(strategy)
    });
    
    if (!response.ok) throw new Error('Failed to simulate strategy');
    return await response.json();
  } catch (error) {
    console.error('Error simulating strategy:', error);
    // Return mock simulation for development
    return {
      final_position: Math.max(1, strategy.starting_position + (Math.random() - 0.5) * 4),
      total_time: '1:32:45.123',
      pit_stops: strategy.pit_stops.length,
      tire_degradation: Math.round(65 + Math.random() * 30),
      fuel_consumption: Math.round(95 + Math.random() * 10),
      risk_factor: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      probability_of_points: Math.round(40 + Math.random() * 50)
    };
  }
};

// Mock data generators for development
const generateMockTelemetry = (): TelemetryData[] => {
  const data: TelemetryData[] = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      lap: Math.floor(i / 10) + 1,
      time: new Date(Date.now() - (50 - i) * 1000).toISOString(),
      speed: 250 + Math.random() * 80,
      throttle: 60 + Math.random() * 40,
      brake: Math.random() * 100,
      gear: Math.floor(3 + Math.random() * 5),
      drs: Math.random() > 0.7,
      ers_deployment: Math.random() * 160,
      tire_temp: [90, 92, 88, 91].map(temp => temp + Math.random() * 10),
      engine_temp: 85 + Math.random() * 15,
      fuel_level: 100 - (i * 2)
    });
  }
  return data;
};

const generateMockSessionData = (): SessionData => {
  return {
    session_type: 'Race',
    track: 'Bahrain International Circuit',
    weather: {
      air_temp: 28,
      track_temp: 45,
      humidity: 62,
      wind_speed: 15,
      wind_direction: 'NE',
      rain_probability: 15
    },
    drivers: [
      { driver_code: 'VER', name: 'Max Verstappen', team: 'Red Bull', position: 1, lap_time: '1:32.847', gap: 'Leader' },
      { driver_code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', position: 2, lap_time: '1:33.012', gap: '+2.347' },
      { driver_code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', position: 3, lap_time: '1:33.198', gap: '+5.823' },
      { driver_code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', position: 4, lap_time: '1:33.445', gap: '+8.934' },
      { driver_code: 'RUS', name: 'George Russell', team: 'Mercedes', position: 5, lap_time: '1:33.567', gap: '+12.456' }
    ]
  };
};

// WebSocket connection for real-time data
export class RealTimeDataConnection {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private onData: (data: any) => void, private onError: (error: any) => void) {}

  connect() {
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onData(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onError(error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.onError(error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}