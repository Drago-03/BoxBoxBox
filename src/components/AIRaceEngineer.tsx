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
import useSound from 'use-sound';

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
  const [transcript, setTranscript] = useState('');
  
  // Speech synthesis setup
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Sound effects
  const [playActivate] = useSound('/sounds/button-click.mp3', { volume: 0.5 });
  const [playMessage] = useSound('/sounds/start-signal.mp3', { volume: 0.3 });

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
      
      // Initialize speech recognition if supported
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[event.results.length - 1];
          const transcript = result[0].transcript;
          setTranscript(transcript);
          handleVoiceCommand(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

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

  const speakText = (text: string) => {
    if (speechSynthesisRef.current && isAudioEnabled) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesisRef.current.speak(utterance);
      playMessage();
    }
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
    if (newMessage.audioEnabled && !isSpeaking) {
      speakText(newMessage.content);
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
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        playActivate();
      } else {
        console.error('Speech recognition not supported in this browser');
      }
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
            aria-label="Engineer Mode"
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

          <div className="text-sm text-white bg-gray-700/50 rounded-lg px-3 py-2 max-w-xs">
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                >
                  <Zap className="w-4 h-4 text-blue-400" />
                </motion.div>
                <span className="text-gray-300">Processing...</span>
              </div>
            ) : isListening ? (
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Listening... {transcript && `"${transcript}"`}</span>
              </div>
            ) : (
              <span className="text-gray-300">Press mic to speak with your race engineer</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {messages.map((message) => {
            const Icon = getTypeIcon(message.type);
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', damping: 20 }}
                className={`flex space-x-3 p-3 border rounded-lg ${getPriorityColor(message.priority)} bg-gray-800/40`}
              >
                <div className={`mt-1 ${message.type === 'warning' ? 'text-yellow-400' : message.type === 'strategy' ? 'text-blue-400' : 'text-gray-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      {message.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white mt-1">{message.content}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-xs mt-1">Race engineer will provide updates during the race</p>
          </div>
        )}
      </div>
    </div>
  );
};