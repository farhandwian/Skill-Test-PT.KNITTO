import { Pool } from "pg";
import logger from "@common/logger";
import DatabaseClient from "../../interfaces/db-client.abstract";

export default class PgClient extends DatabaseClient {
  private pool: Pool;

  public constructor() {
    super();
    this.pool = new Pool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432", 10), // Default PostgreSQL port
    });

    Object.seal(this);
  }

  public async connect(): Promise<void> {
    try {
      await this.pool.connect();
      this._connection = this.pool;
      logger.info("Database connection: Successfully established");
    } catch (err) {
      logger.error({ err }, "Unable to connect to the database");
      process.exit(1);
    }
  }

  public async close(): Promise<null | void> {
    if (!this._connection) return null;

    try {
      await this.pool.end();
      logger.info("Database connection: Successfully closed");
    } catch (err) {
      logger.error({ err }, "Unable to close the database connection");
    }
  }

  public async query(text: string, params?: any[]): Promise<any> {
    try {
      const result = await this.pool.query(text, params);
      return result.rows;
    } catch (err) {
      logger.error({ err }, "Error executing query");
      throw err;
    }
  }
}
