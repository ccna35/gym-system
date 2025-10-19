import app from "./app";
import { connectDatabase, closePool } from "./db/connection";
import { MigrationRunner } from "./db/migrations";
import { Server } from "http";

// Get port from environment variables or use default
const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Run migrations
    await MigrationRunner.runAllMigrations();

    // Start the server
    return app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🏠 Homepage: http://localhost:${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server and store reference
let server: Server | undefined;
startServer()
  .then((serverInstance) => {
    server = serverInstance;
  })
  .catch((error) => {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("\n🔄 Received shutdown signal, shutting down gracefully...");

  try {
    // Close database pool
    await closePool();

    // Close server
    if (server) {
      server.close((err?: Error) => {
        if (err) {
          console.error("❌ Error during shutdown:", err);
          process.exit(1);
        }

        console.log("✅ Server closed successfully");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("⏰ Forcing shutdown after 30 seconds...");
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown();
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown();
});
