// import { ProductsRepositoryInMemory } from '../orm/in-memory/repositories';
// import { ProductsRepositorySequelize } from '../orm/sequelize/repositories';
// import { ProductsRepositoryMirkroORM } from '../orm/mikroorm/repositories';
import { UsersRepositoryPG } from "../orm/pg/repositories";

import * as constants from "@config/constants";

import { IEntityGateway } from "@core/use-cases/interfaces";
import { RepositoryFactory } from "./interfaces";

export default class ProductsRepositoryFactory extends RepositoryFactory<IEntityGateway> {
  public create(dbDialect: string): IEntityGateway {
    const { dbDialects } = constants;

    const productsRepositoryMakerByDialect = {
      [dbDialects.POSTGRES_RAW]: () => new UsersRepositoryPG(),
    };

    const repositoryMaker = this.selectRepositoryMaker(
      productsRepositoryMakerByDialect,
      dbDialect
    );

    return repositoryMaker();
  }
}
