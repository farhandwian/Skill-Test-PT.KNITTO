import { User, Product, Order, Image } from "../../entities";
import { PoolClient } from "pg";

interface IWrite<T> {
  save(entity: T, client?: PoolClient): Promise<T>;
  update(
    entity: T,
    context: { id: string },
    client?: PoolClient
  ): Promise<T | null>;
  delete(id: string, client?: PoolClient): Promise<true | null>;
}

interface IRead<T> {
  findAll(client?: PoolClient): Promise<T[]>;
  findOne(id: string, client?: PoolClient): Promise<T | null>;
}

// ... kode lainnya tetap sama ...

interface IAuth<T> {
  findByUsername(username: string): Promise<User | null>;
}

export default interface IEntityGateway
  extends IWrite<any>,
    IRead<any>,
    IAuth<string> {}

export type EntityGatewayDictionary = Record<string, IEntityGateway>;

export interface IUsersGateway
  extends IWrite<User>,
    IRead<User>,
    IAuth<string> {}

export interface IProductsGateway extends IWrite<Product>, IRead<Product> {}

export interface IOrdersGateway extends IWrite<Order>, IRead<Order> {}

export interface IImagesGateway extends IWrite<Image>, IRead<Image> {}
