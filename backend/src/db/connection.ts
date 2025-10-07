import mysql from "mysql2/promise";
import "dotenv/config";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gym_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+00:00",
  multipleStatements: false,
  namedPlaceholders: true,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully");
    console.log(`📊 Connected to: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`🗄️  Database: ${dbConfig.database}`);
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Database connection failed:", error);
    process.exit(1);
  }
};

// Execute query function
export const executeQuery = async (
  query: string,
  params?: any[]
): Promise<any> => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("❌ Query execution failed:", error);
    throw error;
  }
};

// Get connection from pool (for transactions)
export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("❌ Failed to get connection from pool:", error);
    throw error;
  }
};

// Close all connections in pool
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log("✅ MySQL connection pool closed");
  } catch (error) {
    console.error("❌ Error closing connection pool:", error);
  }
};

export default pool;
