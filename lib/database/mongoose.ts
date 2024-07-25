import mongoose, { Mongoose } from "mongoose";

const Mongodb_url = process.env.MONGODB_URL;

interface Mongo_Connection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: Mongo_Connection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;
  
    if(!Mongodb_url) throw new Error('Missing MONGODB_URL');
  
    cached.promise = 
      cached.promise || 
      mongoose.connect(Mongodb_url, { 
        dbName: 'imaginify', bufferCommands: false 
      })
  
    cached.conn = await cached.promise;
  
    return cached.conn;
}