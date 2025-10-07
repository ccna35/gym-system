import fs from "fs";
import path from "path";
import { executeQuery } from "./connection";

export class MigrationRunner {
  private static migrationsPath = path.join(__dirname, "migrations");

  /**
   * Run a specific migration file
   */
  static async runMigration(filename: string): Promise<void> {
    try {
      const migrationPath = path.join(this.migrationsPath, filename);

      if (!fs.existsSync(migrationPath)) {
        throw new Error(`Migration file not found: ${filename}`);
      }

      const migrationSQL = fs.readFileSync(migrationPath, "utf8");

      // Split by semicolon and execute each statement
      const statements = migrationSQL
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

      console.log(`🔄 Running migration: ${filename}`);

      for (const statement of statements) {
        if (statement.trim()) {
          await executeQuery(statement);
        }
      }

      console.log(`✅ Migration completed: ${filename}`);
    } catch (error) {
      console.error(`❌ Migration failed: ${filename}`, error);
      throw error;
    }
  }

  /**
   * Run all migration files in order
   */
  static async runAllMigrations(): Promise<void> {
    try {
      if (!fs.existsSync(this.migrationsPath)) {
        console.log("📁 No migrations directory found, skipping migrations");
        return;
      }

      const migrationFiles = fs
        .readdirSync(this.migrationsPath)
        .filter((file) => file.endsWith(".sql"))
        .sort(); // Run migrations in alphabetical order

      if (migrationFiles.length === 0) {
        console.log("📝 No migration files found");
        return;
      }

      console.log(`🔄 Running ${migrationFiles.length} migration(s)...`);

      for (const file of migrationFiles) {
        await this.runMigration(file);
      }

      console.log("✅ All migrations completed successfully");
    } catch (error) {
      console.error("❌ Migration process failed:", error);
      throw error;
    }
  }

  /**
   * Create tenant applications table
   */
  static async createTenantApplicationsTable(): Promise<void> {
    try {
      await this.runMigration("001_create_tenant_applications.sql");
    } catch (error) {
      console.error("❌ Failed to create tenant applications table:", error);
      throw error;
    }
  }
}
