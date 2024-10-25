import { Pool, PoolClient } from "pg";
import { Order } from "@core/entities";
import { OrderMapper } from "@core/mappers/order";
import IEntityMapper from "@core/mappers/i-entity-mapper";
import { IOrdersGateway } from "@core/use-cases/interfaces";
import { DatabaseRepository } from "@infra/database/orm/interfaces";

export default class OrdersRepositoryPG
  extends DatabaseRepository
  implements IOrdersGateway
{
  private _pool: Pool;
  private _dataMapper: Pick<IEntityMapper<Order, any>, "toDomain">;

  public constructor() {
    super();
    if (this._db instanceof Pool) {
      this._pool = this._db;
    } else {
      throw new Error(
        "Database connection is not a valid PostgreSQL Pool instance"
      );
    }
    this._dataMapper = new OrderMapper();
  }

  private async executeQuery(
    query: string,
    values: any[],
    client?: PoolClient
  ) {
    if (client) {
      return await client.query(query, values);
    } else {
      return await this._pool.query(query, values);
    }
  }

  public async save(order: Order, client?: PoolClient): Promise<Order> {
    const orderRawData = order.toJSON();
    const query = `
      INSERT INTO orders (user_id, product_ids, date, is_paid, meta, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      orderRawData.userId,
      orderRawData.productIds,
      orderRawData.date,
      orderRawData.isPaid,
      JSON.stringify(orderRawData.meta),
    ];

    const result = await this.executeQuery(query, values, client);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async findOne(
    orderId: string,
    client?: PoolClient
  ): Promise<Order | null> {
    const query = `SELECT * FROM orders WHERE id = $1;`;
    const result = await this.executeQuery(query, [orderId], client);

    if (result.rows.length === 0) return null;

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async update(
    order: Order,
    context: { id: string },
    client?: PoolClient
  ): Promise<Order | null> {
    const foundOrder = await this.findOne(context.id, client);
    if (!foundOrder) return null;

    const query = `
      UPDATE orders
      SET user_id = $1, product_ids = $2, date = $3, is_paid = $4, meta = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      order.userId,
      order.productIds,
      order.date,
      order.isPaid,
      JSON.stringify(order.meta),
      context.id,
    ];

    const result = await this.executeQuery(query, values, client);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async delete(id: string, client?: PoolClient): Promise<true | null> {
    const query = `DELETE FROM orders WHERE id = $1 RETURNING id;`;

    const result = await this.executeQuery(query, [id], client);

    if (result.rows.length === 0) return null;

    return true;
  }

  public async findAll(client?: PoolClient): Promise<Order[]> {
    const query = `SELECT * FROM orders;`;

    const result = await this.executeQuery(query, [], client);

    return result.rows.map((row) => this._dataMapper.toDomain(row));
  }

  // Metode transaction tetap sama
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this._pool.connect();

    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
