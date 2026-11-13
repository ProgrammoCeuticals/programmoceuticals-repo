# Hospital Management System - Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Quick Start (Development Mode)

### 1. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Database Setup

**Option A: Using Docker (Recommended)**
```bash
# From project root
docker-compose up -d postgres redis
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb hospital_management

# Update server/.env with your database credentials
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/hospital_management
```

### 3. Environment Configuration

The server/.env file is already configured with development defaults. You can start immediately, but for full functionality, update:

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Any secure string (already set)
- `CLOUDINARY_*` - Only needed for image uploads (optional)
- `EMAIL_*` - Only needed for email notifications (optional)

### 4. Start the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```
Server will run on: http://localhost:5000

**Terminal 2 - Start Client:**
```bash
cd client
npm start
```
Client will run on: http://localhost:4200

## What Works Out of the Box

✅ **Core Features:**
- User authentication and authorization
- Patient management
- Doctor consultations
- Inventory management
- Laboratory management
- Pharmacy operations
- Admin dashboard
- Real-time notifications
- Security features (XSS, CSRF, input validation)

✅ **API Documentation:**
- Available at: http://localhost:5000/api-docs

✅ **Health Check:**
- Available at: http://localhost:5000/health

## Optional Services

**For Image Uploads:** Configure Cloudinary credentials
**For Email Notifications:** Configure SMTP settings
**For Production:** Set up SSL certificates

## Troubleshooting

**Database Connection Issues:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in server/.env
- Run: `npm run db:setup` (if you have the database created)

**Port Conflicts:**
- Server: Change PORT in server/.env
- Client: Use `ng serve --port 4201`

**Missing Dependencies:**
- Run `npm install` in both server and client directories

## Production Deployment

For production deployment, see:
- `docker-compose.prod.yml`
- `server/.env.production`
- Deployment guides in `/docs` folder

## Support

- API Documentation: http://localhost:5000/api-docs
- Architecture: `/docs/ARCHITECTURE.md`
- User Manual: `/docs/USER_MANUAL.md`