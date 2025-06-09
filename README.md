# BoxBoxBox F1 Platform 🏁

A comprehensive AI-enhanced Formula 1 platform combining real-time telemetry, machine learning predictions, 3D visualizations, and an intelligent race engineer assistant.

## 🚀 Features

### Core Platform
- **Live Dashboard**: Real-time telemetry, lap times, and race analytics powered by FastF1
- **Technical Glossary**: Interactive 3D car parts with detailed explanations
- **AI Race Engineer**: Voice-activated assistant with natural language processing
- **Pit Stop Predictor**: ML-powered predictions for pit stop timing and duration
- **Strategy Simulator**: Test different race strategies and see projected outcomes

### AI Race Engineer
- **Voice Recognition**: Powered by Web Speech API with continuous listening
- **Natural Language Processing**: Context-aware responses to race-related queries
- **Real-time Analysis**: Live telemetry interpretation and strategic recommendations
- **Multi-modal Interface**: Voice commands with visual feedback and quick actions

### Real-time Analytics
- **Live Telemetry Streaming**: Speed, throttle, brake, gear, DRS, and ERS data
- **Performance Metrics**: Lap time analysis, consistency tracking, and system monitoring
- **Predictive Insights**: Tire degradation, fuel consumption, and strategy optimization
- **Visual Data Representation**: Interactive charts with D3.js and Chart.js

## 🛠 Tech Stack

### Frontend
- **React 18+** with TypeScript
- **TailwindCSS** for styling
- **Three.js** for 3D visualizations
- **Framer Motion** for animations
- **Chart.js & D3.js** for data visualization
- **Web Speech API** for voice interaction

### Backend (Planned)
- **FastAPI** with Python 3.9+
- **PostgreSQL** for data storage
- **Redis** for real-time data caching
- **FAISS/Pinecone** for vector storage
- **OpenAI Whisper** for voice processing
- **GPT-4** for natural language understanding

### APIs & Data Sources
- **FastF1** - Telemetry and lap data
- **Jolpica F1 API** - Race schedules and results
- **OpenAI API** - AI assistant capabilities

## 🏗 Architecture

```
boxboxbox/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIRaceEngineer.tsx
│   │   ├── RealTimeAnalytics.tsx
│   │   ├── CarVisualization.tsx
│   │   └── ...
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx
│   │   ├── Glossary.tsx
│   │   ├── AIAssistant.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useRealTimeData.ts
│   │   └── useTelemetryData.ts
│   ├── utils/              # Utility functions
│   │   └── api.ts
│   └── types/              # TypeScript definitions
├── backend/                # FastAPI backend (planned)
│   ├── main.py
│   ├── routers/
│   ├── ml_models/
│   └── rag_pipeline/
└── docs/                   # Documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/boxboxbox-f1-platform.git
cd boxboxbox-f1-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_JOLPICA_API_KEY=your_jolpica_api_key
```

## 🎯 Usage

### AI Race Engineer
1. Navigate to the Dashboard and select the "AI Engineer" tab
2. Click the microphone button to start voice interaction
3. Ask questions like:
   - "Should I pit now?"
   - "What's my tire status?"
   - "Show me the weather forecast"
   - "What's my current position?"

### Real-time Analytics
1. Go to Dashboard → Analytics tab
2. View live telemetry data including speed, throttle, brake inputs
3. Monitor performance metrics and system status
4. Analyze ERS deployment and tire temperature data

### Strategy Simulation
1. Visit the Strategy Simulator page
2. Configure starting position, tire strategy, and pit stops
3. Set race parameters like aggressiveness and weather
4. Run simulation to see predicted outcomes

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📊 Performance

- **Real-time Updates**: 100ms response time for voice commands
- **Data Streaming**: 10Hz telemetry data updates
- **Voice Recognition**: >95% accuracy in quiet environments
- **Cross-browser Support**: Chrome, Firefox, Safari, Edge

## 🔒 Security

- API key management through environment variables
- CORS configuration for secure cross-origin requests
- Input validation for all user interactions
- Rate limiting for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mantej Singh Arora**  
Founder @ Indie Hub  
- LinkedIn: [linkedin.com/in/mantej-singh-arora](https://linkedin.com/in/mantej-singh-arora)  
- GitHub: [@Drago-03](https://github.com/Drago-03)

## 🙏 Acknowledgments

- FastF1 team for the excellent telemetry API
- Formula 1 community for inspiration and feedback
- Open source contributors and maintainers

---

**BoxBoxBox** - Bringing AI-powered insights to Formula 1 racing 🏎️