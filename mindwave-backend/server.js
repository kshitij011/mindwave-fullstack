import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"; // ✅ import cors
import agentRoutes from "./routes/agent.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for requests from localhost:3001 (your frontend)
app.use(
    cors({
        origin: ["http://localhost:3001", "https://your-frontend-domain.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use("/api/agent", agentRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
