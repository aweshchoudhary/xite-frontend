import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set");
    return;
  }

  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI!);

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
