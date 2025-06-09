# BoxBoxBox F1 Platform

<div align="center">
  <img src="assets/images/senna_helmet.png" alt="Ayrton Senna's Helmet" width="150" />
  <h3>"If you no longer go for a gap that exists, you're no longer a racing driver."</h3>
  <p><i>- Ayrton Senna</i></p>
  <br/>
  <p>A comprehensive AI-enhanced Formula 1 platform combining real-time telemetry, machine learning predictions, 3D visualizations, and an intelligent race engineer assistant.</p>
</div>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#ui-components">UI Components</a> •
  <a href="#animations">Animations</a> •
  <a href="#contributing">Contributing</a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.103.0-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
</div>

## ✨ Features

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

## 🛠️ Tech Stack

### Frontend
- **React 18+** with TypeScript
- **TailwindCSS** for styling
- **Three.js** for 3D visualizations
- **Framer Motion** for animations
- **Chart.js & D3.js** for data visualization
- **Web Speech API** for voice interaction

### Backend (Python-Only Implementation)
- **Python 3.9+** - STRICT REQUIREMENT: All backend logic MUST be implemented in Python
- **FastAPI** for RESTful API endpoints and WebSocket connections
- **PostgreSQL** with SQLAlchemy ORM for data persistence
- **Redis** for real-time data caching and pub/sub messaging
- **Pandas & NumPy** for data processing and analysis
- **scikit-learn & PyTorch** for machine learning models
- **FAISS/Pinecone** for vector storage and similarity search
- **Pydantic** for data validation and settings management
- **Celery** for background task processing
- **pytest** for comprehensive test coverage

### APIs & Data Sources
- **FastF1** Python package - Telemetry and lap data
- **Jolpica F1 API** - Race schedules and results
- **OpenAI API** with Python client - AI assistant capabilities

## 🏗️ Architecture

```
boxboxbox/
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript definitions
├── backend/                 # Python-only backend implementation
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── api/             # API endpoints and routers
│   │   ├── core/            # Core application logic
│   │   ├── db/              # Database models and schemas
│   │   ├── services/        # Business logic services
│   │   ├── ml_models/       # Machine learning models
│   │   ├── rag_pipeline/    # Retrieval-augmented generation
│   │   └── utils/           # Utility functions
│   ├── tests/               # Python unit and integration tests
│   ├── pyproject.toml       # Python dependencies and config
│   └── Dockerfile           # Backend container definition
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Frontend)
- Python 3.9+ (Backend - STRICT REQUIREMENT)
- PostgreSQL 14+
- Redis 6+

### Installation

#### Frontend
1. Clone the repository:
```bash
git clone https://github.com/yourusername/boxboxbox-f1-platform.git
cd boxboxbox-f1-platform/frontend
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

#### Backend (Python Only)
1. Navigate to the backend directory:
```bash
cd boxboxbox-f1-platform/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -e .
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the Python backend server:
```bash
uvicorn app.main:app --reload
```

## 🚢 Deployment

### Docker Deployment

We use Docker for containerized deployment. The project includes Docker configurations for both frontend and backend.

#### Building and Running Docker Containers

1. Build and run the backend container:
```bash
cd backend
docker build -t boxboxbox-backend .
docker run -p 8000:8000 --env-file .env boxboxbox-backend
```

2. Build and run the frontend container:
```bash
cd frontend
docker build -t boxboxbox-frontend .
docker run -p 80:80 boxboxbox-frontend
```

3. Or use Docker Compose for the entire stack:
```bash
docker-compose up -d
```

### Cloud Deployment Options

The application is designed to be deployed on various cloud platforms:

#### AWS Deployment
- Backend: AWS ECS with Fargate
- Frontend: AWS Amplify or S3 + CloudFront
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis
- CI/CD: AWS CodePipeline

#### Azure Deployment
- Backend: Azure Container Apps
- Frontend: Azure Static Web Apps
- Database: Azure Database for PostgreSQL
- Cache: Azure Cache for Redis
- CI/CD: Azure DevOps Pipelines

#### Self-Hosted Kubernetes
- Use the provided Kubernetes manifests in `k8s/` directory
- Deploy with `kubectl apply -f k8s/`

## 🎮 UI Components

### Interactive Buttons

The application features multiple custom button styles:

#### Racing Button
- 3D effect with depth perception
- Animated hover and click states
- Team color variants (red, blue, green, yellow)
- Sound effects on interaction
- Ripple animation on click

```jsx
<RacingButton color="red" onClick={handleAction}>
  Start Race
</RacingButton>
```

#### Toggle Switches
- Animated state transitions
- DRS-style activation animation
- Haptic feedback animation

```jsx
<DRSToggle isActive={isDrsEnabled} onChange={toggleDRS} />
```

### Loading Screen

An immersive F1-themed loading experience:

- Ayrton Senna tribute with rotating quotes
- 3D helmet visualization with reflections
- Racing-inspired progress bar with track sections
- F1 starting lights sequence
- Ambient sound effects

### Telemetry Visualizations

- Real-time updating charts with smooth animations
- Interactive tooltips and zoom functionality
- Team color-coded data lines
- Responsive layout adapting to different screen sizes

## ✨ Animations

The BoxBoxBox platform features extensive animations to create an immersive F1 experience:

### Page Transitions
- Smooth page transitions with racing-inspired effects
- Content reveal animations based on scroll position
- Parallax effects for depth perception

### Interactive Elements
- Button hover and click animations
- Form input focus states with animated highlights
- Toggle switches with F1-inspired animations
- Dropdown menus with acceleration/deceleration easing

### Data Visualizations
- Animated data updates with smooth transitions
- Speed lines and motion blur effects
- Particle effects for emphasis
- Racing-inspired loading spinners

### Performance Optimizations
- Hardware-accelerated animations using CSS transforms
- RAF-based animations for smooth performance
- Reduced motion settings for accessibility
- Optimized for 60fps on all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the established code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure all animations are performant and accessible
- Python backend code must follow PEP 8 guidelines

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
- Ayrton Senna's legacy for inspiration
- Open source contributors and maintainers

---

<div align="center">
  <p>BoxBoxBox - Bringing AI-powered insights to Formula 1 racing 🏎️</p>
  <img src="https://img.shields.io/badge/Built%20with-❤️-red?style=for-the-badge" alt="Built with love" />
</div>
