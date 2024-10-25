import { Pool, PoolClient } from "pg";
import { Product } from "@core/entities";
import { ProductMapper } from "@core/mappers/product";
import { UserMapper } from "@core/mappers/user";
import IEntityMapper from "@core/mappers/i-entity-mapper";
import { IProductsGateway } from "@core/use-cases/interfaces";
import { DatabaseRepository } from "@infra/database/orm/interfaces";
import { User } from "@core/entities";

export default class ProductsRepositoryPG
  extends DatabaseRepository
  implements IProductsGateway
{
  private _pool: Pool;
  private _dataMapper: Pick<IEntityMapper<Product, any>, "toDomain">;
  private _dataMapperUser: Pick<IEntityMapper<User, any>, "toDomain">;

  public constructor() {
    super();
    if (this._db instanceof Pool) {
      this._pool = this._db;
    } else {
      throw new Error(
        "Database connection is not a valid PostgreSQL Pool instance"
      );
    }
    this._dataMapper = new ProductMapper();
    this._dataMapperUser = new UserMapper();
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

  public async save(product: Product, client?: PoolClient): Promise<Product> {
    const productRawData = product.toJSON();
    const query = `
      INSERT INTO products (name, description, price, color, quantity, meta, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      productRawData.name,
      productRawData.description,
      productRawData.price,
      productRawData.color,
      productRawData.quantity, // Added quantity
      JSON.stringify(productRawData.meta),
    ];

    const result = await this.executeQuery(query, values, client);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async findOne(
    productId: string,
    client?: PoolClient
  ): Promise<Product | null> {
    console.log("ini product findOne id" + productId);

    const query = `SELECT * FROM products WHERE id = $1;`;
    const result = await this.executeQuery(query, [productId], client);

    if (result.rows.length === 0) return null;

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async update(
    product: Product,
    context: { id: string },
    client?: PoolClient
  ): Promise<Product | null> {
    const foundProduct = await this.findOne(context.id, client);
    if (!foundProduct) return null;

    const query = `
      UPDATE products
      SET name = $1, description = $2, price = $3, color = $4, quantity = $5, meta = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      product.name,
      product.description,
      product.price,
      product.color,
      product.quantity, // Added quantity
      JSON.stringify(product.meta),
      context.id,
    ];

    const result = await this.executeQuery(query, values, client);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async delete(id: string, client?: PoolClient): Promise<true | null> {
    const query = `DELETE FROM products WHERE id = $1 RETURNING id;`;

    const result = await this.executeQuery(query, [id], client);

    if (result.rows.length === 0) return null;

    return true;
  }

  public async findAll(client?: PoolClient): Promise<Product[]> {
    const query = `SELECT * FROM products;`;

    const result = await this.executeQuery(query, [], client);

    return result.rows.map((row) => this._dataMapper.toDomain(row));
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE username = $1;`;
    const result = await this._pool.query(query, [username]);

    if (result.rows.length === 0) return null;

    return this._dataMapperUser.toDomain(result.rows[0]);
  }

  // Transaction method (optional, if you want to add it)
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
