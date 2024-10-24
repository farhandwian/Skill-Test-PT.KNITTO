import { UsersRepositoryPG } from "../orm/pg/repositories";

import * as constants from "@config/constants";

import { IEntityGateway } from "@core/use-cases/interfaces";
import { RepositoryFactory } from "./interfaces";

export default class UsersRepositoryFactory extends RepositoryFactory<IEntityGateway> {
  public create(dbDialect: string): IEntityGateway {
    const { dbDialects } = constants;

    const usersRepositoryMakerByDialect = {
      [dbDialects.POSTGRES_RAW]: () => new UsersRepositoryPG(),
    };

    const repositoryMaker = this.selectRepositoryMaker(
      usersRepositoryMakerByDialect,
      dbDialect
    );

    return repositoryMaker();
  }
}
