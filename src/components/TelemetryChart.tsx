import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { BarChart3, Gauge, Thermometer } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TelemetryChartProps {
  selectedDriver: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ selectedDriver }) => {
  // Mock telemetry data - in real implementation, this would come from FastF1
  const telemetryData = useMemo(() => {
    const laps = Array.from({ length: 20 }, (_, i) => i + 1);
    const speeds = laps.map(() => 280 + Math.random() * 40);
    const throttle = laps.map(() => 70 + Math.random() * 30);
    const brake = laps.map(() => Math.random() * 100);
    const gear = laps.map(() => Math.floor(3 + Math.random() * 5));

    return { laps, speeds, throttle, brake, gear };
  }, [selectedDriver]);

  const speedChartData = {
    labels: telemetryData.laps.map(lap => `Lap ${lap}`),
    datasets: [
      {
        label: 'Speed (km/h)',
        data: telemetryData.speeds,
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      }
    ]
  };

  const inputsChartData = {
    labels: telemetryData.laps.map(lap => `Lap ${lap}`),
    datasets: [
      {
        label: 'Throttle (%)',
        data: telemetryData.throttle,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Brake (%)',
        data: telemetryData.brake,
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: false,
        tension: 0.4,
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
          font: {
            size: 12
          }
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
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const currentStats = {
    speed: Math.round(telemetryData.speeds[telemetryData.speeds.length - 1]),
    throttle: Math.round(telemetryData.throttle[telemetryData.throttle.length - 1]),
    brake: Math.round(telemetryData.brake[telemetryData.brake.length - 1]),
    gear: telemetryData.gear[telemetryData.gear.length - 1],
    engineTemp: 85 + Math.random() * 15,
    tyreTemp: 90 + Math.random() * 20
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
          Telemetry - {selectedDriver}
        </h3>
        <div className="text-sm text-gray-400">
          Real-time data stream
        </div>
      </div>

      {/* Current Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6"
      >
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <Gauge className="w-5 h-5 mx-auto mb-1 text-red-500" />
          <div className="text-lg font-bold text-white">{currentStats.speed}</div>
          <div className="text-xs text-gray-400">km/h</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{currentStats.throttle}%</div>
          <div className="text-xs text-gray-400">Throttle</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">{currentStats.brake}%</div>
          <div className="text-xs text-gray-400">Brake</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{currentStats.gear}</div>
          <div className="text-xs text-gray-400">Gear</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-500" />
          <div className="text-lg font-bold text-orange-400">{Math.round(currentStats.engineTemp)}°</div>
          <div className="text-xs text-gray-400">Engine</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-400">{Math.round(currentStats.tyreTemp)}°</div>
          <div className="text-xs text-gray-400">Tyre</div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-700/20 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Speed Profile</h4>
          <div className="h-48">
            <Line data={speedChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-700/20 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Driver Inputs</h4>
          <div className="h-48">
            <Line data={inputsChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};