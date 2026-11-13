import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import encounterRoutes from './routes/encounter.routes';
import followUpRoutes from './routes/followup.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';
import usersRoutes from './routes/users.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200', credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// Stricter rate limit on auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/patients', generalLimiter, patientRoutes);
app.use('/api/v1/encounters', generalLimiter, encounterRoutes);
app.use('/api/v1/follow-ups', generalLimiter, followUpRoutes);
app.use('/api/v1/dashboard', generalLimiter, dashboardRoutes);
app.use('/api/v1/analytics', generalLimiter, analyticsRoutes);
app.use('/api/v1/users', generalLimiter, usersRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', app: 'PharmaCare PMS', version: '2.0' }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err?.message ?? err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
