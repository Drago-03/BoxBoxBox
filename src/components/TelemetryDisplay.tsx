import { useEffect, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { formatTelemetryValue, processTelemetryData } from '../utils/telemetryUtils';
import { TelemetryDataPoint } from '../types/telemetry';
import { motion } from 'framer-motion';
import RacingButton from './RacingButton';

const TelemetryDisplay = () => {
  const { 
    telemetryData, 
    isLoading, 
    error, 
    sessionId, 
    selectedDriver,
    setSelectedDriver,
    availableSessions,
    setSessionId,
    refreshTelemetry,
    isLiveMode,
    setLiveMode
  } = useTelemetry();
  
  const [latestDataPoint, setLatestDataPoint] = useState<TelemetryDataPoint | null>(null);
  
  // Update latest data point when telemetry data changes
  useEffect(() => {
    if (telemetryData && telemetryData.data && telemetryData.data.length > 0) {
      setLatestDataPoint(telemetryData.data[0]);
    }
  }, [telemetryData]);
  
  // Handle session change
  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSessionId(value === '' ? null : value);
  };
  
  // Handle driver change
  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDriver(value === '' ? null : value);
  };
  
  // Toggle live mode
  const toggleLiveMode = () => {
    setLiveMode(!isLiveMode);
  };
  
  // List of available drivers (in a real app, this would come from the API)
  const availableDrivers = [
    { id: 'HAM', name: 'Lewis Hamilton' },
    { id: 'VER', name: 'Max Verstappen' },
    { id: 'LEC', name: 'Charles Leclerc' },
    { id: 'NOR', name: 'Lando Norris' },
    { id: 'SAI', name: 'Carlos Sainz' }
  ];
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Telemetry Dashboard</h2>
          
          <div className="flex items-center space-x-3">
            <RacingButton
              onClick={toggleLiveMode}
              color={isLiveMode ? 'green' : 'blue'}
              size="sm"
            >
              {isLiveMode ? 'Live Mode' : 'Static Mode'}
            </RacingButton>
            
            <RacingButton
              onClick={refreshTelemetry}
              color="yellow"
              size="sm"
              disabled={isLoading}
            >
              Refresh Data
            </RacingButton>
          </div>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Session selector */}
          <div>
            <label htmlFor="session" className="block text-sm font-medium text-gray-400 mb-1">
              Session
            </label>
            <select
              id="session"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md text-white py-2 px-3"
              value={sessionId || ''}
              onChange={handleSessionChange}
            >
              <option value="">Select a session</option>
              {availableSessions.map((session) => (
                <option key={session.id} value={session.id.toString()}>
                  {session.notes || `${session.session_type} - ${new Date(session.session_date).toLocaleDateString()}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Driver selector */}
          <div>
            <label htmlFor="driver" className="block text-sm font-medium text-gray-400 mb-1">
              Driver
            </label>
            <select
              id="driver"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md text-white py-2 px-3"
              value={selectedDriver || ''}
              onChange={handleDriverChange}
              disabled={!sessionId}
            >
              <option value="">All Drivers</option>
              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-white p-3 rounded-md">
            {error}
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-6">
            <motion.div
              className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <span className="ml-3 text-white">Loading telemetry data...</span>
          </div>
        )}
        
        {/* Telemetry display */}
        {!isLoading && latestDataPoint && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Speed */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Speed</div>
              <div className="text-2xl font-bold text-white">
                {formatTelemetryValue(latestDataPoint.speed, 'speed')}
              </div>
            </div>
            
            {/* Throttle */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Throttle</div>
              <div className="text-2xl font-bold text-white">
                {formatTelemetryValue(latestDataPoint.throttle, 'throttle')}
              </div>
              <div className="w-full bg-gray-600 h-1.5 mt-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  animate={{ width: `${latestDataPoint.throttle || 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            {/* Brake */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Brake</div>
              <div className="text-2xl font-bold text-white">
                {formatTelemetryValue(latestDataPoint.brake, 'brake')}
              </div>
              <div className="w-full bg-gray-600 h-1.5 mt-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-500"
                  animate={{ width: `${latestDataPoint.brake || 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            {/* Gear */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Gear</div>
              <div className="text-3xl font-bold text-white">
                {formatTelemetryValue(latestDataPoint.gear, 'gear')}
              </div>
            </div>
            
            {/* RPM */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">RPM</div>
              <div className="text-2xl font-bold text-white">
                {formatTelemetryValue(latestDataPoint.rpm, 'rpm')}
              </div>
            </div>
            
            {/* DRS */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">DRS</div>
              <div className="text-2xl font-bold text-white">
                {latestDataPoint.drs === 1 ? 'ACTIVE' : 'INACTIVE'}
              </div>
              <div className={`h-2 w-2 rounded-full mt-2 ${latestDataPoint.drs === 1 ? 'bg-blue-500' : 'bg-gray-500'}`} />
            </div>
            
            {/* Lap */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Lap</div>
              <div className="text-2xl font-bold text-white">
                {latestDataPoint.lap || 'N/A'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {telemetryData?.lap_count ? `of ${telemetryData.lap_count}` : ''}
              </div>
            </div>
            
            {/* Tire Compound */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tire Compound</div>
              <div className="text-2xl font-bold text-white capitalize">
                {latestDataPoint.tire_compound || 'N/A'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Life: {formatTelemetryValue(latestDataPoint.tire_life, 'tire_life')}
              </div>
            </div>
          </div>
        )}
        
        {/* No data message */}
        {!isLoading && !latestDataPoint && !error && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg">No telemetry data available</p>
            <p className="text-sm mt-2">Select a session and driver to view telemetry data</p>
          </div>
        )}
        
        {/* Session info */}
        {telemetryData && (
          <div className="mt-4 text-xs text-gray-400">
            Last updated: {new Date(telemetryData.last_update).toLocaleTimeString()}
            {isLiveMode && <span className="ml-2 text-green-400">(Live Mode)</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryDisplay; 