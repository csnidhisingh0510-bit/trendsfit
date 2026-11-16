import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { authRouter } from "./server/auth.js";
import { wardrobeRouter } from "./server/wardrobe.js";
import { recommendationsRouter } from "./server/recommendations.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve API routes
app.use("/api/auth", authRouter);
app.use("/api/wardrobe", wardrobeRouter);
app.use("/api/recommendations", recommendationsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Setup Vite middleware for development or serve built files for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static frontend assets
    app.use(express.static(distPath));
    
    // SPA Fallback: send index.html for all non-API requests
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrendFits full-stack server running at http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to initialize Vite middleware", err);
});
