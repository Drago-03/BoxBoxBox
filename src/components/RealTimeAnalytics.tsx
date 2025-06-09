import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  Activity, 
  Zap, 
  Gauge, 
  TrendingUp, 
  Timer, 
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RealTimeAnalyticsProps {
  selectedDriver: string;
  isLive: boolean;
}

interface TelemetryData {
  speed: number[];
  throttle: number[];
  brake: number[];
  gear: number[];
  drs: boolean[];
  lapTimes: number[];
  sectorTimes: number[][];
  tireTemp: number[];
  engineTemp: number;
  fuelLevel: number;
  ersDeployment: number[];
  timestamps: string[];
}

export const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({
  selectedDriver,
  isLive
}) => {
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    speed: [],
    throttle: [],
    brake: [],
    gear: [],
    drs: [],
    lapTimes: [],
    sectorTimes: [],
    tireTemp: [],
    engineTemp: 85,
    fuelLevel: 75,
    ersDeployment: [],
    timestamps: []
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgLapTime: 0,
    bestLapTime: 0,
    consistency: 0,
    tirePerformance: 0,
    fuelEfficiency: 0,
    ersEfficiency: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      updateTelemetryData();
    }, 100); // Update every 100ms for smooth real-time feel

    return () => clearInterval(interval);
  }, [isLive, selectedDriver]);

  const updateTelemetryData = () => {
    setTelemetryData(prev => {
      const newSpeed = 250 + Math.random() * 80;
      const newThrottle = 60 + Math.random() * 40;
      const newBrake = Math.random() * 100;
      const newGear = Math.floor(3 + Math.random() * 5);
      const newDRS = Math.random() > 0.7;
      const newERS = Math.random() * 160;
      const newTireTemp = 90 + Math.random() * 30;
      const timestamp = new Date().toLocaleTimeString();

      const maxDataPoints = 50;

      return {
        speed: [...prev.speed.slice(-maxDataPoints), newSpeed],
        throttle: [...prev.throttle.slice(-maxDataPoints), newThrottle],
        brake: [...prev.brake.slice(-maxDataPoints), newBrake],
        gear: [...prev.gear.slice(-maxDataPoints), newGear],
        drs: [...prev.drs.slice(-maxDataPoints), newDRS],
        lapTimes: prev.lapTimes,
        sectorTimes: prev.sectorTimes,
        tireTemp: [...prev.tireTemp.slice(-maxDataPoints), newTireTemp],
        engineTemp: 85 + Math.random() * 15,
        fuelLevel: Math.max(0, prev.fuelLevel - 0.01),
        ersDeployment: [...prev.ersDeployment.slice(-maxDataPoints), newERS],
        timestamps: [...prev.timestamps.slice(-maxDataPoints), timestamp]
      };
    });

    // Update performance metrics
    setPerformanceMetrics({
      avgLapTime: 92.5 + Math.random() * 2,
      bestLapTime: 91.2 + Math.random() * 1,
      consistency: 85 + Math.random() * 10,
      tirePerformance: 70 + Math.random() * 25,
      fuelEfficiency: 88 + Math.random() * 8,
      ersEfficiency: 82 + Math.random() * 12
    });
  };

  const speedChartData = {
    labels: telemetryData.timestamps,
    datasets: [
      {
        label: 'Speed (km/h)',
        data: telemetryData.speed,
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }
    ]
  };

  const inputsChartData = {
    labels: telemetryData.timestamps,
    datasets: [
      {
        label: 'Throttle (%)',
        data: telemetryData.throttle,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Brake (%)',
        data: telemetryData.brake,
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }
    ]
  };

  const ersChartData = {
    labels: ['Deployed', 'Available'],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ['#3B82F6', '#6B7280'],
        borderColor: ['#1D4ED8', '#374151'],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D1D5DB',
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 10 }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    animation: {
      duration: 0 // Disable animations for real-time data
    }
  };

  const currentMetrics = {
    speed: telemetryData.speed[telemetryData.speed.length - 1] || 0,
    throttle: telemetryData.throttle[telemetryData.throttle.length - 1] || 0,
    brake: telemetryData.brake[telemetryData.brake.length - 1] || 0,
    gear: telemetryData.gear[telemetryData.gear.length - 1] || 1,
    drs: telemetryData.drs[telemetryData.drs.length - 1] || false,
    tireTemp: telemetryData.tireTemp[telemetryData.tireTemp.length - 1] || 0,
    ers: telemetryData.ersDeployment[telemetryData.ersDeployment.length - 1] || 0
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <motion.div
          animate={{ scale: isLive ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: isLive ? Infinity : 0, duration: 2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center"
        >
          <Gauge className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <div className="text-2xl font-bold text-white">{Math.round(currentMetrics.speed)}</div>
          <div className="text-xs text-gray-400">km/h</div>
        </motion.div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{Math.round(currentMetrics.throttle)}%</div>
          <div className="text-xs text-gray-400">Throttle</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{Math.round(currentMetrics.brake)}%</div>
          <div className="text-xs text-gray-400">Brake</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{currentMetrics.gear}</div>
          <div className="text-xs text-gray-400">Gear</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
          <Zap className={`w-6 h-6 mx-auto mb-2 ${currentMetrics.drs ? 'text-green-400' : 'text-gray-500'}`} />
          <div className="text-xs text-gray-400">DRS</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{Math.round(currentMetrics.tireTemp)}°</div>
          <div className="text-xs text-gray-400">Tire Temp</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{Math.round(currentMetrics.ers)}</div>
          <div className="text-xs text-gray-400">ERS (kW)</div>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              Speed Profile
            </h4>
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          </div>
          <div className="h-48">
            <Line data={speedChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Driver Inputs
            </h4>
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          </div>
          <div className="h-48">
            <Line data={inputsChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Timer className="w-5 h-5 mr-2 text-blue-500" />
            Lap Performance
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Best Lap</span>
              <span className="text-green-400 font-mono">{performanceMetrics.bestLapTime.toFixed(3)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average</span>
              <span className="text-white font-mono">{performanceMetrics.avgLapTime.toFixed(3)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Consistency</span>
              <span className="text-blue-400">{Math.round(performanceMetrics.consistency)}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
            System Status
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Engine Temp</span>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">{Math.round(telemetryData.engineTemp)}°C</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fuel Level</span>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">{Math.round(telemetryData.fuelLevel)}%</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">ERS Efficiency</span>
              <span className="text-purple-400">{Math.round(performanceMetrics.ersEfficiency)}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">ERS Deployment</h4>
          <div className="h-32">
            <Doughnut 
              data={ersChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#D1D5DB',
                      font: { size: 10 }
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};