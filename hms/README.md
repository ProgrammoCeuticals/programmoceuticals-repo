# Hospital Management System

A comprehensive hospital management system built with Angular frontend and Node.js backend.

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm

### Installation

1. **Install Dependencies**
```bash
# Server
cd server && npm install

# Client  
cd client && npm install
```

2. **Database Setup**
```bash
# Using Docker (recommended)
docker-compose up -d

# Or create local PostgreSQL database
createdb hospital_management
```

3. **Start Application**
```bash
# Terminal 1 - Server (http://localhost:5000)
cd server && npm run dev

# Terminal 2 - Client (http://localhost:4200)  
cd client && npm start
```

## Features

- Patient & Doctor Management
- Appointment Scheduling
- Inventory & Pharmacy Management
- Laboratory Management
- Financial Management
- Admin Dashboard
- Authentication & Authorization

## API Documentation
Available at: http://localhost:5000/api-docs

## License
MIT License