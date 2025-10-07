import { executeQuery } from "./connection";

// Test database connection with a simple query
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await executeQuery("SELECT 1 as test");
    console.log("🔍 Database test query result:", result);
    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error);
    return false;
  }
};

// Get database version
export const getDatabaseInfo = async () => {
  try {
    const versionResult = await executeQuery("SELECT VERSION() as version");
    const tablesResult = await executeQuery("SHOW TABLES");

    return {
      version: versionResult[0]?.version || "Unknown",
      tables: tablesResult.length || 0,
      tablesNames: tablesResult.map((row: any) => Object.values(row)[0]),
    };
  } catch (error) {
    console.error("❌ Failed to get database info:", error);
    return null;
  }
};
