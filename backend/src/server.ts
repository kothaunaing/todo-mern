import { configDotenv } from "dotenv";
import express from "express";
import allRoutes from "./routes/index";

configDotenv();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", allRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
