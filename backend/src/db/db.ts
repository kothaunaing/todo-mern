import { configDotenv } from "dotenv";
import { createPool } from "mysql2";

configDotenv();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
}).promise();

export default pool;
