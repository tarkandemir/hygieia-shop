import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached | undefined;
}

const cached: Cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Parse existing URI and add performance parameters
    const uri = new URL(MONGODB_URI!);
    uri.searchParams.set('maxPoolSize', '20');
    uri.searchParams.set('serverSelectionTimeoutMS', '2000');
    uri.searchParams.set('socketTimeoutMS', '20000');
    uri.searchParams.set('maxIdleTimeMS', '10000');
    uri.searchParams.set('connectTimeoutMS', '2000');
    uri.searchParams.set('heartbeatFrequencyMS', '10000');
    uri.searchParams.set('retryReads', 'true');
    uri.searchParams.set('retryWrites', 'true');
    uri.searchParams.set('w', 'majority');

    const opts = {
      bufferCommands: false,
      family: 4, // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose.connect(uri.toString(), opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
