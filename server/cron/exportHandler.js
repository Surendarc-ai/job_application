import { connectDB } from '../db.js';
import { runScheduledExport } from '../utils/exportAllToExcel.js';

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    const result = await runScheduledExport();
    console.log('Scheduled export completed:', JSON.stringify(result));
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, ...result }),
    };
  } catch (err) {
    console.error('Scheduled export failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
}
