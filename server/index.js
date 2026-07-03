import 'dotenv/config';
import app from './app.js';
import { connectDB } from './db.js';
import { seedRoles } from './utils/seedRoles.js';
import { migrateUsers } from './utils/migrateUsers.js';
import { migrateEntityCompanyIds } from './utils/migrateEntityCompanyIds.js';
import { startExportCron } from './cron/scheduler.js';

const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:5174'];

async function start() {
  try {
    await connectDB();
    console.log('MongoDB connected');
    console.log('Allowed CORS origins:', allowedOrigins);
    await seedRoles();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (process.env.EXPORT_CRON_ENABLED === 'true') {
        startExportCron();
      }
      migrateUsers()
        .then(() => migrateEntityCompanyIds())
        .catch((err) => console.error('Background migration error:', err.message));
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
