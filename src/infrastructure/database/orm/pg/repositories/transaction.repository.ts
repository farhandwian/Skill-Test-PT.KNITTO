import { Pool, PoolClient } from "pg";

export interface ITransactionRepository {
  beginTransaction(): Promise<PoolClient>;
  commitTransaction(client: PoolClient): Promise<void>;
  rollbackTransaction(client: PoolClient): Promise<void>;
  releaseClient(client: PoolClient): void;
}

export default class TransactionRepositoryPG implements ITransactionRepository {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  async beginTransaction(): Promise<PoolClient> {
    const client = await this.dbPool.connect();
    await client.query("BEGIN");
    return client;
  }

  async commitTransaction(client: PoolClient): Promise<void> {
    await client.query("COMMIT");
  }

  async rollbackTransaction(client: PoolClient): Promise<void> {
    await client.query("ROLLBACK");
  }

  releaseClient(client: PoolClient): void {
    client.release();
  }
}
