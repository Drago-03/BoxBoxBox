import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Thermometer, Wind, Eye, Droplets } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  // Mock weather data - in real implementation, this would come from weather API
  const weatherData = {
    condition: 'Partly Cloudy',
    temperature: {
      air: 28,
      track: 45,
      humidity: 62
    },
    wind: {
      speed: 15,
      direction: 'NE'
    },
    visibility: 10,
    pressure: 1013,
    rainChance: 15,
    icon: Cloud
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <weatherData.icon className="w-5 h-5 mr-2 text-blue-400" />
          Weather Conditions
        </h3>
        <div className="text-xs text-gray-400">Bahrain International Circuit</div>
      </div>

      <div className="space-y-4">
        {/* Current Condition */}
        <div className="text-center pb-4 border-b border-gray-700/50">
          <div className="text-2xl font-bold text-white mb-1">{weatherData.temperature.air}°C</div>
          <div className="text-sm text-gray-400">{weatherData.condition}</div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-red-400" />
            <div>
              <div className="text-sm text-white font-medium">{weatherData.temperature.track}°C</div>
              <div className="text-xs text-gray-400">Track Temp</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-sm text-white font-medium">{weatherData.temperature.humidity}%</div>
              <div className="text-xs text-gray-400">Humidity</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-green-400" />
            <div>
              <div className="text-sm text-white font-medium">{weatherData.wind.speed} km/h</div>
              <div className="text-xs text-gray-400">Wind {weatherData.wind.direction}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-sm text-white font-medium">{weatherData.visibility} km</div>
              <div className="text-xs text-gray-400">Visibility</div>
            </div>
          </div>
        </div>

        {/* Rain Probability */}
        <div className="pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Rain Probability</span>
            <span className="text-sm font-medium text-white">{weatherData.rainChance}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${weatherData.rainChance}%` }}
            />
          </div>
        </div>

        {/* Pressure */}
        <div className="text-center text-xs text-gray-400">
          Pressure: {weatherData.pressure} hPa
        </div>
      </div>
    </motion.div>
  );
};