import mongoose from "mongoose";

const mongoDB = "mongodb://127.0.0.1:27017/Wassup";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
const Schema = mongoose.Schema;
const Model = mongoose.model;

export { Schema, Model };
