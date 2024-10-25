import { Pool } from "pg";
import { User } from "@core/entities";
import { UserMapper } from "@core/mappers/user";
import IEntityMapper from "@core/mappers/i-entity-mapper";
import { IUsersGateway } from "@core/use-cases/interfaces";
import { DatabaseRepository } from "@infra/database/orm/interfaces";

export default class UsersRepositoryPG
  extends DatabaseRepository
  implements IUsersGateway
{
  private _pool: Pool;
  private _dataMapper: Pick<IEntityMapper<User, any>, "toDomain">;

  public constructor() {
    super();
    if (this._db instanceof Pool) {
      this._pool = this._db;
    } else {
      throw new Error(
        "Database connection is not a valid PostgreSQL Pool instance"
      );
    }
    this._dataMapper = new UserMapper();
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE username = $1;`;
    const result = await this._pool.query(query, [username]);

    if (result.rows.length === 0) return null;

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async save(user: User): Promise<User> {
    const userRawData = user.toJSON();
    const query = `
      INSERT INTO users (username, password, first_name, last_name, meta, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      userRawData.username,
      userRawData.password, // pastikan menggunakan password yang di-hash
      userRawData.firstName,
      userRawData.lastName,
      JSON.stringify(userRawData.meta),
    ];

    const result = await this._pool.query(query, values);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async findOne(userId: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1;`;
    const result = await this._pool.query(query, [userId]);

    if (result.rows.length === 0) return null;

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async update(
    user: User,
    context: { id: string }
  ): Promise<User | null> {
    const foundUser = await this.findOne(context.id);
    if (!foundUser) return null;

    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, meta = $3, updated_at = NOW()
      WHERE user_id = $4
      RETURNING *;
    `;

    const values = [
      user.firstName,
      user.lastName,
      JSON.stringify(user.meta),
      context.id,
    ];

    const result = await this._pool.query(query, values);

    return this._dataMapper.toDomain(result.rows[0]);
  }

  public async delete(id: string): Promise<true | null> {
    const query = `DELETE FROM users WHERE user_id = $1 RETURNING user_id;`;

    const result = await this._pool.query(query, [id]);

    if (result.rows.length === 0) return null;

    return true;
  }

  public async findAll(): Promise<User[]> {
    const query = `SELECT * FROM users;`;

    const result = await this._pool.query(query);

    return result.rows.map((row) => this._dataMapper.toDomain(row));
  }
}
