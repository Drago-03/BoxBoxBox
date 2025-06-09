import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Brain, 
  Zap, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

interface RaceEngineerProps {
  isRaceActive: boolean;
  currentLap: number;
  totalLaps: number;
  selectedDriver: string;
  telemetryData: any;
}

interface EngineerMessage {
  id: string;
  type: 'strategy' | 'warning' | 'info' | 'response';
  content: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  audioEnabled: boolean;
}

export const AIRaceEngineer: React.FC<RaceEngineerProps> = ({
  isRaceActive,
  currentLap,
  totalLaps,
  selectedDriver,
  telemetryData
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<EngineerMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [engineerMode, setEngineerMode] = useState<'strategic' | 'technical' | 'performance'>('strategic');

  const { speak, cancel, speaking, supported: speechSupported } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      handleVoiceCommand(result);
    },
    onError: (error: any) => {
      console.error('Speech recognition error:', error);
    }
  });

  // Simulate real-time race engineer insights
  useEffect(() => {
    if (!isRaceActive) return;

    const interval = setInterval(() => {
      generateRaceInsight();
    }, 15000); // Generate insights every 15 seconds during race

    return () => clearInterval(interval);
  }, [isRaceActive, currentLap, selectedDriver]);

  const generateRaceInsight = () => {
    const insights = [
      {
        type: 'strategy' as const,
        content: `Lap ${currentLap}: Optimal pit window opening in 3 laps. Track position vs tire advantage analysis suggests pit now.`,
        priority: 'high' as const
      },
      {
        type: 'warning' as const,
        content: `Tire degradation at 78%. Consider switching to more conservative driving mode.`,
        priority: 'medium' as const
      },
      {
        type: 'info' as const,
        content: `Gap to car ahead: 1.2s. DRS available next sector. Opportunity for overtake at Turn 14.`,
        priority: 'medium' as const
      },
      {
        type: 'strategy' as const,
        content: `Weather radar shows 15% rain probability in 20 minutes. Monitor for strategy adjustment.`,
        priority: 'low' as const
      }
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    addMessage(randomInsight);
  };

  const addMessage = (message: Omit<EngineerMessage, 'id' | 'timestamp' | 'audioEnabled'>) => {
    const newMessage: EngineerMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      audioEnabled: isAudioEnabled && message.priority !== 'low'
    };

    setMessages(prev => [newMessage, ...prev.slice(0, 9)]); // Keep last 10 messages

    // Speak high priority messages
    if (newMessage.audioEnabled && speechSupported && !speaking) {
      speak({ text: newMessage.content, rate: 1.1, pitch: 0.9 });
    }
  };

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Process voice command and generate response
    const response = await processRaceEngineerCommand(command);
    
    addMessage({
      type: 'response',
      content: response,
      priority: 'medium'
    });

    setIsProcessing(false);
  };

  const processRaceEngineerCommand = async (command: string): Promise<string> => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('pit') || lowerCommand.includes('stop')) {
      return `Pit window analysis: Current gap to car behind is 8.2s. Pit stop will take approximately 2.4s. You'll rejoin in P${Math.floor(Math.random() * 3) + 4}. Recommend pitting in 2 laps for optimal track position.`;
    }
    
    if (lowerCommand.includes('tire') || lowerCommand.includes('tyre')) {
      return `Current tire analysis: Medium compound at 72% life. Degradation rate is 0.08s per lap. Optimal performance window remaining: 8-10 laps. Consider switching to hard compound for stint extension.`;
    }
    
    if (lowerCommand.includes('gap') || lowerCommand.includes('position')) {
      return `Position update: P${Math.floor(Math.random() * 5) + 3}. Gap to leader: +${(Math.random() * 20 + 5).toFixed(1)}s. Gap to car ahead: ${(Math.random() * 3 + 0.5).toFixed(1)}s. Gap to car behind: +${(Math.random() * 5 + 2).toFixed(1)}s.`;
    }
    
    if (lowerCommand.includes('weather') || lowerCommand.includes('rain')) {
      return `Weather update: Current conditions dry. Track temperature 42°C. Rain probability next 30 minutes: 12%. Wind speed: 8 km/h from northeast. No immediate strategy changes required.`;
    }
    
    if (lowerCommand.includes('fuel') || lowerCommand.includes('consumption')) {
      return `Fuel analysis: Current consumption 1.8 kg/lap, target 1.75 kg/lap. Fuel remaining sufficient for ${totalLaps - currentLap + 3} laps. Recommend lift-and-coast in sectors 2 and 3 to optimize consumption.`;
    }

    return `Command received: "${command}". Analyzing race data and telemetry. Current focus: ${engineerMode} optimization. Lap ${currentLap} of ${totalLaps}. All systems nominal.`;
  };

  const toggleListening = () => {
    if (listening) {
      stop();
      setIsListening(false);
    } else {
      listen({ continuous: true, interimResults: false });
      setIsListening(true);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 border-red-500/50';
      case 'high': return 'text-orange-400 border-orange-500/50';
      case 'medium': return 'text-blue-400 border-blue-500/50';
      case 'low': return 'text-gray-400 border-gray-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return Target;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      case 'response': return Brain;
      default: return Radio;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Race Engineer</h3>
            <p className="text-xs text-gray-400">
              {isRaceActive ? `Lap ${currentLap}/${totalLaps} • ${selectedDriver}` : 'Standby Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Engineer Mode Selector */}
          <select
            value={engineerMode}
            onChange={(e) => setEngineerMode(e.target.value as any)}
            className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm"
          >
            <option value="strategic">Strategic</option>
            <option value="technical">Technical</option>
            <option value="performance">Performance</option>
          </select>

          {/* Audio Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isAudioEnabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-700/50 text-gray-400'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Voice Interface */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            disabled={isProcessing}
            className={`relative p-4 rounded-full transition-all ${
              isListening 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 rounded-full border-2 border-red-400"
              />
            )}
          </motion.button>

          <div className="text-center">
            <div className="text-sm font-medium text-white">
              {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Press to talk'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Ask about strategy, tires, fuel, weather
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <span className="text-sm ml-2">Analyzing race data...</span>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => {
            const IconComponent = getTypeIcon(message.type);
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg border ${getPriorityColor(message.priority)} bg-gray-700/20`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium uppercase tracking-wide">
                        {message.type}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              {isRaceActive 
                ? 'Race engineer ready. Voice commands active.' 
                : 'Race engineer on standby. Activate during race session.'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleVoiceCommand('What is my current tire status?')}
            className="px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm transition-colors"
          >
            Tire Status
          </button>
          <button
            onClick={() => handleVoiceCommand('Should I pit now?')}
            className="px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm transition-colors"
          >
            Pit Strategy
          </button>
          <button
            onClick={() => handleVoiceCommand('What is the weather forecast?')}
            className="px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm transition-colors"
          >
            Weather Update
          </button>
          <button
            onClick={() => handleVoiceCommand('Show me my position and gaps')}
            className="px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm transition-colors"
          >
            Position Update
          </button>
        </div>
      </div>
    </div>
  );
};