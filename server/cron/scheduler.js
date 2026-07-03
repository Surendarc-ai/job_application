import cron from 'node-cron';
import { connectDB } from '../db.js';
import { runScheduledExport } from '../utils/exportAllToExcel.js';

export function startExportCron() {
  const tz = process.env.EXPORT_CRON_TZ || 'Asia/Kolkata';
  const schedule = process.env.EXPORT_CRON_SCHEDULE || '0 2 * * *';

  if (!cron.validate(schedule)) {
    console.error(`Invalid EXPORT_CRON_SCHEDULE: ${schedule}`);
    return;
  }

  console.log(`Export cron enabled: ${schedule} (${tz})`);

  cron.schedule(schedule, async () => {
    try {
      await connectDB();
      const result = await runScheduledExport();
      console.log('Scheduled export completed:', result);
    } catch (err) {
      console.error('Scheduled export failed:', err.message);
    }
  }, { timezone: tz });
}
