import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import allRoutes from "./routes/index";
import path from "path";

configDotenv();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", allRoutes);

if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("/*w", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
