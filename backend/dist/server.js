"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use("/api", index_1.default);
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../frontend/dist/index.html"));
    });
}
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
