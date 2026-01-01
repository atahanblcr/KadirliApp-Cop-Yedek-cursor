import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import profileRoutes from './routes/profile.routes';
import pharmacyRoutes from './routes/pharmacy.routes';
import deathRoutes from './routes/death.routes';
import announcementRoutes from './routes/announcement.routes';
import eventRoutes from './routes/event.routes';
import campaignRoutes from './routes/campaign.routes';
import placeRoutes from './routes/place.routes';
import guideRoutes from './routes/guide.routes';
import transportRoutes from './routes/transport.routes';
import adRoutes from './routes/ad.routes';
import taxiRequestRoutes from './routes/taxi-request.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Kadirli Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/deaths', deathRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/taxi-requests', taxiRequestRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

