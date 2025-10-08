import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Create Express application
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Basic route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Gym Management System API",
    version: "1.0.0",
  });
});

// Health check route
app.get("/health", async (req, res) => {
  try {
    const { testDatabaseConnection, getDatabaseInfo } = await import(
      "./db/utils"
    );
    const dbStatus = await testDatabaseConnection();
    const dbInfo = dbStatus ? await getDatabaseInfo() : null;

    res.status(200).json({
      success: true,
      message: "Server is running successfully",
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus,
        ...dbInfo,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Server is running successfully",
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: "Database connection test failed",
      },
    });
  }
});

// Import routes
// Versioned routing
import v1Router from "./routes/v1/index";
import { API_VERSIONS } from "./config/apiVersion";

// Attach version/metadata headers middleware
app.use((req, res, next) => {
  res.setHeader("X-API-Version", API_VERSIONS.current);
  res.setHeader("X-API-Supported-Versions", API_VERSIONS.supported.join(","));
  if (API_VERSIONS.deprecated.length) {
    res.setHeader(
      "X-API-Deprecated-Versions",
      API_VERSIONS.deprecated.join(",")
    );
  }
  next();
});

// Mount current version
app.use("/api/v1", v1Router);

// Backward compatibility: legacy un-versioned routes (temporary)
app.use("/api", (req, res) => {
  res.status(301).json({
    success: true,
    message: "API base moved. Use versioned routes under /api/v1",
    currentVersion: API_VERSIONS.current,
    examples: {
      tenantApplications: "/api/v1/tenant-applications",
    },
  });
});

// Non-namespaced version info (explicit)
app.get("/api/version", (req, res) => {
  res.json({
    success: true,
    current: API_VERSIONS.current,
    supported: API_VERSIONS.supported,
    deprecated: API_VERSIONS.deprecated,
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

export default app;
