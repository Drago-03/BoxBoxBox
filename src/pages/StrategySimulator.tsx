import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Play, BarChart3, TrendingUp, Settings, Flag } from 'lucide-react';

interface SimulationResult {
  finalPosition: number;
  totalTime: string;
  pitStops: number;
  tyreDegradation: number;
  fuelConsumption: number;
  riskFactor: string;
  probabilityOfPoints: number;
  comparison: {
    baseline: number;
    improvement: number;
  };
}

export const StrategySimulator: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [strategy, setStrategy] = useState({
    startingPosition: 5,
    startingTyre: 'medium',
    pitStopLaps: [18, 38],
    tyreSequence: ['medium', 'hard', 'soft'],
    raceLength: 57,
    aggressiveness: 'balanced',
    weatherForecast: 'dry'
  });

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    // Simulate complex strategy calculation
    setTimeout(() => {
      const finalPos = Math.max(1, strategy.startingPosition + (Math.random() - 0.5) * 4);
      const timeVariation = (Math.random() - 0.5) * 30;
      const baseTime = 5400 + timeVariation; // ~90 minutes base race time
      
      const simulationResult: SimulationResult = {
        finalPosition: Math.round(finalPos),
        totalTime: `${Math.floor(baseTime / 60)}:${(baseTime % 60).toFixed(3).padStart(6, '0')}`,
        pitStops: strategy.pitStopLaps.length,
        tyreDegradation: Math.round(65 + Math.random() * 30),
        fuelConsumption: Math.round(95 + Math.random() * 10),
        riskFactor: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        probabilityOfPoints: Math.round(40 + Math.random() * 50),
        comparison: {
          baseline: strategy.startingPosition,
          improvement: strategy.startingPosition - Math.round(finalPos)
        }
      };
      
      setResult(simulationResult);
      setIsSimulating(false);
    }, 3000);
  };

  const addPitStop = () => {
    if (strategy.pitStopLaps.length < 3) {
      const newLap = Math.round(strategy.raceLength * (0.3 + Math.random() * 0.4));
      setStrategy(prev => ({
        ...prev,
        pitStopLaps: [...prev.pitStopLaps, newLap].sort((a, b) => a - b),
        tyreSequence: [...prev.tyreSequence, 'medium']
      }));
    }
  };

  const removePitStop = (index: number) => {
    if (strategy.pitStopLaps.length > 1) {
      setStrategy(prev => ({
        ...prev,
        pitStopLaps: prev.pitStopLaps.filter((_, i) => i !== index),
        tyreSequence: prev.tyreSequence.filter((_, i) => i !== index + 1)
      }));
    }
  };

  const getTyreColor = (compound: string) => {
    const colors = {
      soft: 'bg-red-500',
      medium: 'bg-yellow-500',
      hard: 'bg-gray-300'
    };
    return colors[compound as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Target className="w-8 h-8 mr-3 text-red-500" />
            Race Strategy Simulator
          </h1>
          <p className="text-gray-400">
            Test different race strategies and see predicted outcomes using AI simulation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-red-500" />
              Strategy Configuration
            </h3>

            <div className="space-y-6">
              {/* Starting Position */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Starting Position: P{strategy.startingPosition}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strategy.startingPosition}
                  onChange={(e) => setStrategy(prev => ({ ...prev, startingPosition: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Starting Tyre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Starting Tyre</label>
                <div className="grid grid-cols-3 gap-2">
                  {['soft', 'medium', 'hard'].map(compound => (
                    <button
                      key={compound}
                      onClick={() => setStrategy(prev => ({ 
                        ...prev, 
                        startingTyre: compound,
                        tyreSequence: [compound, ...prev.tyreSequence.slice(1)]
                      }))}
                      className={`p-3 rounded-lg transition-all capitalize flex items-center justify-center space-x-2 ${
                        strategy.startingTyre === compound
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${getTyreColor(compound)}`} />
                      <span>{compound}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pit Stop Strategy */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-300">Pit Stop Strategy</label>
                  <button
                    onClick={addPitStop}
                    disabled={strategy.pitStopLaps.length >= 3}
                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Pit Stop
                  </button>
                </div>
                
                <div className="space-y-3">
                  {strategy.pitStopLaps.map((lap, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Flag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Lap {lap}</span>
                      </div>
                      
                      <div className="flex-1">
                        <input
                          type="range"
                          min="5"
                          max={strategy.raceLength - 5}
                          value={lap}
                          onChange={(e) => {
                            const newLaps = [...strategy.pitStopLaps];
                            newLaps[index] = parseInt(e.target.value);
                            setStrategy(prev => ({ ...prev, pitStopLaps: newLaps.sort((a, b) => a - b) }));
                          }}
                          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <select
                        value={strategy.tyreSequence[index + 1]}
                        onChange={(e) => {
                          const newSequence = [...strategy.tyreSequence];
                          newSequence[index + 1] = e.target.value;
                          setStrategy(prev => ({ ...prev, tyreSequence: newSequence }));
                        }}
                        className="px-2 py-1 bg-gray-600 rounded text-white text-sm"
                      >
                        <option value="soft">Soft</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>

                      <button
                        onClick={() => removePitStop(index)}
                        disabled={strategy.pitStopLaps.length <= 1}
                        className="px-2 py-1 text-red-400 hover:bg-red-600/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Race Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Aggressiveness</label>
                  <select
                    value={strategy.aggressiveness}
                    onChange={(e) => setStrategy(prev => ({ ...prev, aggressiveness: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="balanced">Balanced</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weather</label>
                  <select
                    value={strategy.weatherForecast}
                    onChange={(e) => setStrategy(prev => ({ ...prev, weatherForecast: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                  >
                    <option value="dry">Dry</option>
                    <option value="mixed">Mixed</option>
                    <option value="wet">Wet</option>
                  </select>
                </div>
              </div>

              {/* Simulate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulate}
                disabled={isSimulating}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSimulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Simulating Race...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Run Simulation</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Result */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Simulation Result
              </h3>

              {result ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">
                      P{result.finalPosition}
                    </div>
                    <div className="text-gray-400">Final Position</div>
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        result.comparison.improvement > 0 
                          ? 'bg-green-600/20 text-green-400' 
                          : result.comparison.improvement < 0
                          ? 'bg-red-600/20 text-red-400'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {result.comparison.improvement > 0 ? '+' : ''}{result.comparison.improvement} positions
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Time</span>
                      <span className="text-white font-mono">{result.totalTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pit Stops</span>
                      <span className="text-white">{result.pitStops}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Points Probability</span>
                      <span className="text-green-400">{result.probabilityOfPoints}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Factor</span>
                      <span className={`${
                        result.riskFactor === 'Low' ? 'text-green-400' :
                        result.riskFactor === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.riskFactor}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Run simulation to see results</p>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            {result && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Tyre Degradation</span>
                      <span className="text-sm text-white">{result.tyreDegradation}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${result.tyreDegradation}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Fuel Efficiency</span>
                      <span className="text-sm text-white">{result.fuelConsumption}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${result.fuelConsumption}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};