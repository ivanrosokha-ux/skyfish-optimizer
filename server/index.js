import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import upgradesRoutes from './routes/upgradesRoutes.js';
import buildsRoutes from './routes/buildsRoutes.js';
import bazaarRoutes from './routes/bazaarRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SkyFish Optimizer API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/upgrades', upgradesRoutes);
app.use('/api/builds', buildsRoutes);
app.use('/api/bazaar', bazaarRoutes);

// 404 fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Маршрут ${req.originalUrl} не знайдено на сервері API`,
  });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Внутрішня помилка сервера',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SkyFish Optimizer Express Backend running on http://localhost:${PORT}`);
});

export default app;
