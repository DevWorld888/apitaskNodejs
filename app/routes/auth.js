import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { users } from "../drizzle/schema.js";
import { db } from "../drizzle/client.js";
