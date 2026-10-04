import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDatabase() {
  if (!config.mongodbUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  await mongoose.connect(config.mongodbUri);
  console.log("MongoDB connected successfully.");
}
