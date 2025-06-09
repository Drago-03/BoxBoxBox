import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Flag, Users, TrendingUp, Zap, Radio } from 'lucide-react';
import { TelemetryChart } from '../components/TelemetryChart';
import { LiveTiming } from '../components/LiveTiming';
import { WeatherWidget } from '../components/WeatherWidget';
import { AIRaceEngineer } from '../components/AIRaceEngineer';
import { RealTimeAnalytics } from '../components/RealTimeAnalytics';
import { TelemetryProvider } from '../context/TelemetryContext';
import TelemetryDisplay from '../components/TelemetryDisplay';

export const Dashboard: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState('VER');
  const [isLive, setIsLive] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'engineer'>('overview');

  // Mock data - in real implementation, this would come from FastF1
  const mockData = {
    currentRace: 'Bahrain Grand Prix',
    session: 'Race',
    lap: 47,
    totalLaps: 57,
    leaders: [
      { position: 1, driver: 'VER', name: 'Max Verstappen', team: 'Red Bull', time: '1:32.847', gap: 'Leader' },
      { position: 2, driver: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', time: '1:33.012', gap: '+2.347' },
      { position: 3, driver: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', time: '1:33.198', gap: '+5.823' },
      { position: 4, driver: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', time: '1:33.445', gap: '+8.934' },
      { position: 5, driver: 'RUS', name: 'George Russell', team: 'Mercedes', time: '1:33.567', gap: '+12.456' }
    ]
  };

  const stats = [
    { label: 'Current Lap', value: `${mockData.lap}/${mockData.totalLaps}`, icon: Flag },
    { label: 'Session', value: mockData.session, icon: Activity },
    { label: 'Track Temp', value: '45°C', icon: TrendingUp },
    { label: 'DRS Zones', value: '2 Active', icon: Zap }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Dashboard</h1>
          <p className="text-gray-400 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span>{isLive ? 'Live' : 'Offline'} • {mockData.currentRace}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {/* View Selector */}
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Overview', icon: Activity },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'engineer', label: 'AI Engineer', icon: Radio }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeView === key
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLive 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <div key={stat.label} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Dynamic Content Based on Active View */}
      {activeView === 'overview' && (
        <>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Timing */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <LiveTiming drivers={mockData.leaders} selectedDriver={selectedDriver} onDriverSelect={setSelectedDriver} />
            </motion.div>

            {/* Weather & Track Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <WeatherWidget />
              
              {/* Track Status */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-green-500" />
                  Track Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Condition</span>
                    <span className="text-green-400 font-medium">Green Flag</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Safety Car</span>
                    <span className="text-gray-300">No</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">DRS</span>
                    <span className="text-blue-400 font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Yellow Flags</span>
                    <span className="text-gray-300">None</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Telemetry Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TelemetryChart selectedDriver={selectedDriver} />
          </motion.div>
        </>
      )}

      {activeView === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
            <TelemetryProvider>
              <TelemetryDisplay />
            </TelemetryProvider>
          </div>
          <RealTimeAnalytics selectedDriver={selectedDriver} isLive={isLive} />
        </motion.div>
      )}

      {activeView === 'engineer' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AIRaceEngineer
            isRaceActive={isLive}
            currentLap={mockData.lap}
            totalLaps={mockData.totalLaps}
            selectedDriver={selectedDriver}
            telemetryData={{}}
          />
          
          {/* Additional Engineer Analytics */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Strategy Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-blue-400 font-medium">Pit Window</span>
                  </div>
                  <p className="text-gray-300 text-sm">Optimal pit window opens in 3 laps. Current gap to car behind: 8.2s</p>
                </div>
                
                <div className="p-4 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-yellow-400 font-medium">Tire Management</span>
                  </div>
                  <p className="text-gray-300 text-sm">Current tire degradation at 72%. Consider lift-and-coast in sector 3</p>
                </div>
                
                <div className="p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-400 font-medium">Track Position</span>
                  </div>
                  <p className="text-gray-300 text-sm">Maintain current pace. Gap to car ahead decreasing by 0.1s per lap</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">+0.3s</div>
                  <div className="text-xs text-gray-400">Sector 1 vs Best</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">-0.1s</div>
                  <div className="text-xs text-gray-400">Sector 2 vs Best</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">+0.2s</div>
                  <div className="text-xs text-gray-400">Sector 3 vs Best</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">92.4s</div>
                  <div className="text-xs text-gray-400">Current Lap</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};