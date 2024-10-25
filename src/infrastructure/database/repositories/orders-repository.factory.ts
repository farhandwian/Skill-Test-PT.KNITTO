import { OrdersRepositoryPG } from "../orm/pg/repositories";

import * as constants from "../../../config/constants";

import { IOrdersGateway } from "@core/use-cases/interfaces";
import { RepositoryFactory } from "./interfaces";

export default class OrdersRepositoryFactory extends RepositoryFactory<IOrdersGateway> {
  public create(dbDialect: string): IOrdersGateway {
    const { dbDialects } = constants;

    const ordersRepositoryMakerByDialect = {
      [dbDialects.POSTGRES_RAW]: () => new OrdersRepositoryPG(),
    };

    const repositoryMaker = this.selectRepositoryMaker(
      ordersRepositoryMakerByDialect,
      dbDialect
    );

    return repositoryMaker();
  }
}
