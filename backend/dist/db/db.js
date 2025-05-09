"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const mysql2_1 = require("mysql2");
(0, dotenv_1.configDotenv)();
const pool = (0, mysql2_1.createPool)({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
}).promise();
exports.default = pool;
