import { configDotenv } from "dotenv";
import { createPool } from "mysql2";

configDotenv();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT!) || undefined,
}).promise();

export default pool;
