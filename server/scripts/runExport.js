import 'dotenv/config';
import { connectDB } from '../db.js';
import { runScheduledExport } from '../utils/exportAllToExcel.js';

try {
  await connectDB();
  const result = await runScheduledExport();
  console.log('Export completed:', result);
  process.exit(0);
} catch (err) {
  console.error('Export failed:', err.message);
  process.exit(1);
}
