import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://csurendar8_db_user:eqBz81kmykrZvlLW@jobapplication.fk4wlw8.mongodb.net';

const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

let connectPromise = null;

function poolOptions() {
  // Lambda: 1 socket per instance. Many warm instances × pool of 5 exhausts M0 (500).
  const maxPoolSize = Number(process.env.MONGODB_MAX_POOL_SIZE) || (isLambda ? 1 : 2);
  return {
    maxPoolSize,
    minPoolSize: 0,
    maxIdleTimeMS: Number(process.env.MONGODB_MAX_IDLE_MS) || 15000,
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 30000,
    socketTimeoutMS: 45000,
  };
}

mongoose.connection.on('disconnected', () => {
  connectPromise = null;
});

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI, poolOptions()).catch((err) => {
      connectPromise = null;
      throw err;
    });
  }

  await connectPromise;
  return mongoose.connection;
}
