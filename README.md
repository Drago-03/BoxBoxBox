## BoxBoxBox 🏁

A full-stack, AI-enhanced web platform for Formula 1 fans, analysts, and aspiring engineers. Combines real-time data, machine learning predictions, fan interaction, retrieval-augmented generation (RAG) components, and 3D explainers into one powerful application.

---

### 🧱 Project Structure

```
boxboxbox/
├── frontend/               # React app (Next.js / Vite + TailwindCSS)
│   ├── components/
│   ├── pages/
│   ├── public/
│   └── assets/3d-models/   # Three.js + GLTF models
│
├── backend/                # FastAPI backend
│   ├── main.py             # API entrypoint
│   ├── routers/
│   │   ├── telemetry.py    # FastF1 integration
│   │   ├── jolpica.py      # Jolpica proxy endpoints
│   │   └── rag.py          # RAG query endpoints
│   └── utils/
│       └── fastf1_helpers.py
│
├── ml-models/              # Machine Learning models
│   ├── pit_stop_predictor.ipynb
│   └── strategy_simulator.py
│
├── rag-pipeline/           # Retrieval-Augmented Generation
│   ├── vector_store.faiss  # Vector DB for motorsport glossary
│   ├── index_documents.py  # Text splitting and embedding
│   └── query_pipeline.py   # Retrieval + LLM answer generation
│
├── data/                   # Static or preprocessed datasets
│   ├── race_stats.csv
│   └── driver_data/
│
├── .env                    # API keys for Jolpica etc.
├── requirements.txt        # FastAPI, FastF1, Langchain, FAISS, etc.
├── README.md
└── LICENSE
```

---

### 🚀 Modules & Features

#### 1. F1 Technical Glossary + 3D Visualizer
- Interactive car part explainers using Three.js
- Markdown/JSON-based glossary content
- RAG-based question answering on car parts, rules, and terminology

#### 2. Live Race Data Dashboard
- Real-time telemetry from FastF1
- Sector gaps, tyre choices, delta timings
- Data visualizations (React + D3.js)

#### 3. Fan Interaction Platform
- Live polls, race predictions, trivia contests
- Socket.io or WebSocket-based real-time features

#### 4. Pit Stop Time Predictor
- ML model to estimate pit stop durations
- Input: tyre compound, track, weather, driver/team

#### 5. Race Strategy Simulator
- Rule-based or RL-based sim engine
- Users create virtual strategies and test outcomes

#### 6. F1 Driver Performance Analyzer
- Season-by-season stats
- Qualifying gaps, tyre usage, consistency graphs

#### 7. RAG-powered Motorsports Q&A
- Query your own glossary or database for car components, driver strategies, or race rules
- Uses OpenAI/GPT + FAISS for document-based answering

---

### 🧠 RAG Architecture

#### 🔄 Retrieval-Augmented Generation Pipeline:
1. **Indexing Phase**:
   - Parse technical documents (PDFs/Markdown/JSON)
   - Chunk text (e.g. 300 tokens)
   - Embed using OpenAI/BGE/Sentence Transformers
   - Store in FAISS vector DB

2. **Query Phase**:
   - User asks: "What is a differential in F1?"
   - Retrieve top-k chunks from vector DB
   - Generate answer using OpenAI API (context-aware)

Use Cases:
- Technical glossary chatbot
- Car part visualization support
- Race rule explanation bot

---

### 🧰 Tech Stack

**Frontend**:
- React + Vite/Next.js
- TailwindCSS + D3.js
- Three.js (3D models)

**Backend**:
- FastAPI + Uvicorn
- Python, FastF1
- LangChain + FAISS (for RAG)

**ML/AI**:
- Scikit-learn, XGBoost for pit stop prediction
- Custom simulators for strategy modeling
- OpenAI API or Llama3 (for RAG LLM layer)

**Infra**:
- Docker (eventually)
- Supabase/PostgreSQL (user profiles, strategies)
- Vercel/Render (deployment)

---

### 🔌 APIs Used
- [FastF1](https://theoehrly.github.io/Fast-F1/) – Telemetry, Lap Data, Car State
- [Jolpica F1 API](https://jolpica.com/) – Race schedules, driver info, results
- [OpenAI / Ollama] – LLM responses in RAG

---

### ⚙️ Setup Guide (Coming Soon)
- `requirements.txt` install instructions
- `.env` setup for API keys
- Frontend + backend dev server setup

---

### 📜 License
MIT License — feel free to fork, build, and contribute.

---

### 👑 Author
**Mantej Singh Arora**  
Founder @ Indie Hub  
LinkedIn: [linkedin.com/in/mantej-singh-arora](https://linkedin.com/in/mantej-singh-arora)  
GitHub: [@Drago-03](https://github.com/Drago-03)

---

### 📌 Coming Next
- Glossary document ingestion → vector DB
- FastAPI `/ask` endpoint for glossary bot
- Frontend layout scaffolding
- First working telemetry dashboard
