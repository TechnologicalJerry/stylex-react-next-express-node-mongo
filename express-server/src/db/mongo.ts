import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectMongo() {
  await mongoose.connect(env.MONGO_URI);
  return mongoose.connection;
}