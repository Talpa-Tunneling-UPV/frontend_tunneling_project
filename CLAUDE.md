# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a tunneling machine monitoring system with:
- **Backend**: FastAPI server with CAN bus integration for real-time sensor data processing
- **Frontend**: React + TypeScript application with Vite for monitoring dashboard
- **Infrastructure**: Docker Compose setup with Redis, Nginx reverse proxy, and separate backend/frontend containers
- **Django Backend**: Additional Django application in `backend/back/` directory

## Architecture

### Backend Services
- **FastAPI** (`backend/app/`): Handles CAN bus messages, WebSocket connections, and REST API endpoints
- **Django** (`backend/back/`): Additional backend service (port 8000)
- **Redis**: Message broker for pub/sub communication between components
- **CAN Interface**: Virtual CAN bus communication for sensor data (`vcan0`)

### Frontend
- **React + TypeScript**: Single-page application with routing for different monitoring pages (Sensors, Motors, Hydraulic, Cutting)
- **TailwindCSS**: Styling framework
- **React Query**: Data fetching and caching
- **Recharts**: Data visualization

### Networking
- **Nginx**: Reverse proxy routing:
  - `/` → Frontend (port 80)
  - `/api/` → Backend API (port 8000)
  - `/ws/` → WebSocket connections

## Common Commands

### Docker Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f [service_name]
```

### Backend Development

#### FastAPI Backend
```bash
cd backend/app
# Run locally (requires Redis running)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Install dependencies
pip install -r ../requirements.txt
```

#### Django Backend
```bash
cd backend/back
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Development
```bash
cd frontend/app

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Type checking
npm run build  # TypeScript checking is part of build
```

### CAN Bus Setup (for testing)
```bash
# Create virtual CAN interface
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0

# Verify interface
ip link show vcan0

# Send test CAN message
cansend vcan0 014#0960505050505050

# Monitor CAN traffic
candump vcan0
```

## Key Files and Directories

### Backend Structure
- `backend/app/main.py`: FastAPI application entry point with WebSocket and API endpoints
- `backend/app/can_interface.py`: CAN bus message handling
- `backend/app/canParser.py`: CAN message parsing logic
- `backend/app/websocket.py`: WebSocket connection manager
- `backend/app/redis_client.py`: Redis pub/sub client
- `backend/back/`: Django application directory

### Frontend Structure
- `frontend/app/src/pages/`: React page components (Home, Sensors, Motors, etc.)
- `frontend/app/src/router/`: React Router configuration
- `frontend/app/src/components/`: Reusable React components
- `frontend/app/vite.config.ts`: Vite configuration

### Configuration
- `docker-compose.yml`: Container orchestration
- `nginx/nginx.conf`: Reverse proxy configuration
- `backend/requirements.txt`: Python dependencies (redis, cantools, python-can, fastapi, uvicorn)
- `frontend/app/package.json`: Node dependencies and scripts

## API Endpoints

### FastAPI
- `POST /command`: Send commands to CAN bus components
- `GET /status/{component_id}`: Get component status from Redis
- `WS /ws`: WebSocket connection for real-time updates

## Development Notes

- Backend runs with `NET_ADMIN` and `NET_RAW` capabilities for CAN bus access
- Backend uses host network mode for CAN interface access
- Frontend and other services use bridge network (192.168.16.0/24)
- Redis is used for inter-service communication and caching sensor data
- WebSocket connections provide real-time sensor updates to frontend