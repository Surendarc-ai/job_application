import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://csurendar8_db_user:eqBz81kmykrZvlLW@jobapplication.fk4wlw8.mongodb.net';

let connectPromise = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 30000,
    });
  }

  await connectPromise;
  return mongoose.connection;
}
