import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:5174'];

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, cb) => {
    console.log('CORS request from origin:', origin);
    // Allow requests with no origin (same-origin, mobile apps, Postman, etc.)
    if (!origin) {
      console.log('CORS allowed (no origin)');
      return cb(null, true);
    }
    // Normalize origin (remove trailing slash) for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    // Check if origin is in allowed list
    if (allowedOrigins.includes(normalizedOrigin)) {
      console.log('CORS allowed for:', normalizedOrigin);
      return cb(null, origin); // Return the original origin
    }
    console.log('CORS blocked for:', normalizedOrigin, '- Allowed origins:', allowedOrigins);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 86400,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Fallback CORS header for allowed origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://csurendar8_db_user:eqBz81kmykrZvlLW@jobapplication.fk4wlw8.mongodb.net').then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
