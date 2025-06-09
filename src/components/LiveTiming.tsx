import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface Driver {
  position: number;
  driver: string;
  name: string;
  team: string;
  time: string;
  gap: string;
}

interface LiveTimingProps {
  drivers: Driver[];
  selectedDriver: string;
  onDriverSelect: (driver: string) => void;
}

export const LiveTiming: React.FC<LiveTimingProps> = ({ drivers, selectedDriver, onDriverSelect }) => {
  const getTeamColor = (team: string) => {
    const colors: Record<string, string> = {
      'Red Bull': 'bg-blue-600',
      'Ferrari': 'bg-red-600',
      'Mercedes': 'bg-cyan-500',
      'McLaren': 'bg-orange-500',
      'Alpine': 'bg-pink-500',
      'Aston Martin': 'bg-green-600',
      'Williams': 'bg-blue-400',
      'AlphaTauri': 'bg-slate-600',
      'Alfa Romeo': 'bg-red-800',
      'Haas': 'bg-gray-500'
    };
    return colors[team] || 'bg-gray-600';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-red-500" />
          Live Timing
        </h3>
        <div className="text-sm text-gray-400">
          Last updated: just now
        </div>
      </div>

      <div className="space-y-2">
        {drivers.map((driver, index) => (
          <motion.div
            key={driver.driver}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onDriverSelect(driver.driver)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedDriver === driver.driver
                ? 'bg-red-600/20 border-red-500/50 shadow-lg shadow-red-600/10'
                : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Position */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                driver.position === 1 ? 'bg-yellow-500 text-black' :
                driver.position === 2 ? 'bg-gray-400 text-black' :
                driver.position === 3 ? 'bg-orange-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {driver.position}
              </div>

              {/* Team Color */}
              <div className={`w-1 h-8 rounded ${getTeamColor(driver.team)}`}></div>

              {/* Driver Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-white">{driver.driver}</span>
                  <span className="text-gray-300 truncate">{driver.name}</span>
                </div>
                <div className="text-xs text-gray-400">{driver.team}</div>
              </div>

              {/* Timing */}
              <div className="text-right">
                <div className="font-mono text-sm text-white">{driver.time}</div>
                <div className={`text-xs ${
                  driver.gap === 'Leader' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {driver.gap}
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="w-6 flex justify-center">
                {Math.random() > 0.5 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <div className="text-xs text-gray-400 text-center">
          Click on any driver to view their detailed telemetry data
        </div>
      </div>
    </div>
  );
};