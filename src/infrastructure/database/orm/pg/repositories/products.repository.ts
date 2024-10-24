import { Pool } from "pg";
import { Product } from "@core/entities";
import { ProductMapper } from "@core/mappers/product";
import IEntityMapper from "@core/mappers/i-entity-mapper";
import { IProductsGateway } from "@core/use-cases/interfaces";
import { DatabaseRepository } from "@infra/database/orm/interfaces";

export default class ProductsRepositoryPG
  extends DatabaseRepository
  implements IProductsGateway
{
  private _pool: Pool;
  private _dataMapper: Pick<IEntityMapper<Product, any>, "toDomain">;

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
  }

  public async save(product: Product): Promise<Product> {
    const productRawData = product.toJSON();
    const query = `
      INSERT INTO products (name, description, images, price, color, meta, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      productRawData.name,
      productRawData.description,
      JSON.stringify(productRawData.images),
      productRawData.price,
      productRawData.color,
      JSON.stringify(productRawData.meta),
    ];

    const result = await this._pool.query(query, values);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async findOne(productId: string): Promise<Product | null> {
    const query = `SELECT * FROM products WHERE id = $1;`;
    const result = await this._pool.query(query, [productId]);

    if (result.rows.length === 0) return null;

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async update(
    product: Product,
    context: { id: string }
  ): Promise<Product | null> {
    const foundProduct = await this.findOne(context.id);
    if (!foundProduct) return null;

    const query = `
      UPDATE products
      SET name = $1, description = $2, images = $3, price = $4, color = $5, meta = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      product.name,
      product.description,
      JSON.stringify(product.images),
      product.price,
      product.color,
      JSON.stringify(product.meta),
      context.id,
    ];

    const result = await this._pool.query(query, values);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async delete(id: string): Promise<true | null> {
    const query = `DELETE FROM products WHERE id = $1 RETURNING id;`;

    const result = await this._pool.query(query, [id]);

    if (result.rows.length === 0) return null;

    return true;
  }

  public async findAll(): Promise<Product[]> {
    const query = `SELECT * FROM products;`;

    const result = await this._pool.query(query);

    return result.rows.map((row) => this._dataMapper.toDomain(row));
  }
}
