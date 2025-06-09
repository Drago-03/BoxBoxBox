import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, TrendingUp, Settings, Play, BarChart3 } from 'lucide-react';

export const PitStopPredictor: React.FC = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    driver: 'VER',
    team: 'Red Bull Racing',
    track: 'Bahrain',
    weather: 'dry',
    tyreCompound: 'medium',
    currentLap: 25,
    totalLaps: 57,
    trackTemp: 45,
    pitStopType: 'standard',
    timeOfDay: 'afternoon'
  });

  const drivers = [
    { code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing' },
    { code: 'PER', name: 'Sergio Perez', team: 'Red Bull Racing' },
    { code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari' },
    { code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari' },
    { code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes' },
    { code: 'RUS', name: 'George Russell', team: 'Mercedes' }
  ];

  const tracks = [
    'Bahrain', 'Saudi Arabia', 'Australia', 'Azerbaijan', 'Miami', 'Monaco',
    'Spain', 'Canada', 'Austria', 'Britain', 'Hungary', 'Belgium'
  ];

  const handlePredict = async () => {
    setIsLoading(true);
    
    // Simulate ML prediction - in real implementation, this would call the FastAPI backend
    setTimeout(() => {
      const basePitTime = 2.3 + Math.random() * 0.8; // Base pit stop time
      const variation = (Math.random() - 0.5) * 0.4; // Random variation
      
      const predictedTime = Math.max(2.1, basePitTime + variation);
      const confidenceScore = 85 + Math.random() * 10;
      
      setPrediction({
        predictedTime: predictedTime.toFixed(3),
        confidence: Math.round(confidenceScore),
        factors: {
          teamPerformance: Math.random() > 0.5 ? 'positive' : 'negative',
          trackDifficulty: Math.random() > 0.5 ? 'high' : 'medium',
          weatherImpact: inputs.weather === 'wet' ? 'high' : 'low',
          seasonalTrend: Math.random() > 0.5 ? 'improving' : 'stable'
        },
        recommendations: [
          'Optimal pit window: Lap 28-32',
          'Weather conditions favor current strategy',
          'Team has shown consistent 2.4s average this season'
        ]
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const handleDriverChange = (driverCode: string) => {
    const selectedDriver = drivers.find(d => d.code === driverCode);
    if (selectedDriver) {
      setInputs(prev => ({
        ...prev,
        driver: driverCode,
        team: selectedDriver.team
      }));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Timer className="w-8 h-8 mr-3 text-orange-500" />
            Pit Stop Time Predictor
          </h1>
          <p className="text-gray-400">
            AI-powered predictions for pit stop duration based on multiple factors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-orange-500" />
              Input Parameters
            </h3>

            <div className="space-y-6">
              {/* Driver Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Driver</label>
                <select
                  value={inputs.driver}
                  onChange={(e) => handleDriverChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                >
                  {drivers.map(driver => (
                    <option key={driver.code} value={driver.code}>
                      {driver.name} ({driver.team})
                    </option>
                  ))}
                </select>
              </div>

              {/* Track Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Track</label>
                <select
                  value={inputs.track}
                  onChange={(e) => setInputs(prev => ({ ...prev, track: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                >
                  {tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
              </div>

              {/* Weather Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weather</label>
                <div className="grid grid-cols-2 gap-2">
                  {['dry', 'wet'].map(weather => (
                    <button
                      key={weather}
                      onClick={() => setInputs(prev => ({ ...prev, weather }))}
                      className={`p-3 rounded-lg transition-colors capitalize ${
                        inputs.weather === weather
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {weather}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tyre Compound */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tyre Compound</label>
                <div className="grid grid-cols-3 gap-2">
                  {['soft', 'medium', 'hard'].map(compound => (
                    <button
                      key={compound}
                      onClick={() => setInputs(prev => ({ ...prev, tyreCompound: compound }))}
                      className={`p-3 rounded-lg transition-colors capitalize ${
                        inputs.tyreCompound === compound
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {compound}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Lap */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Lap: {inputs.currentLap}
                </label>
                <input
                  type="range"
                  min="1"
                  max={inputs.totalLaps}
                  value={inputs.currentLap}
                  onChange={(e) => setInputs(prev => ({ ...prev, currentLap: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Track Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Track Temperature: {inputs.trackTemp}°C
                </label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={inputs.trackTemp}
                  onChange={(e) => setInputs(prev => ({ ...prev, trackTemp: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Predict Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Predicting...' : 'Predict Pit Stop Time'}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Prediction Result */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Prediction Result
              </h3>

              {prediction ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-400 mb-2">
                      {prediction.predictedTime}s
                    </div>
                    <div className="text-gray-400">Predicted Pit Stop Time</div>
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                        {prediction.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-sm text-gray-400">Team Performance</div>
                      <div className={`font-medium capitalize ${
                        prediction.factors.teamPerformance === 'positive' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {prediction.factors.teamPerformance}
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-sm text-gray-400">Track Difficulty</div>
                      <div className="font-medium text-yellow-400 capitalize">
                        {prediction.factors.trackDifficulty}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Run a prediction to see results</p>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {prediction && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {prediction.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};