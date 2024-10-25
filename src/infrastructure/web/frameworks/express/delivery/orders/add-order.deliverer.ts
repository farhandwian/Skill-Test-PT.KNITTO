import { NextFunction, Request, Response } from "express";

import { AddOrderController } from "@adapters/controllers/orders";
import {
  OrdersRepositoryFactory,
  ProductsRepositoryFactory,
  UsersRepositoryFactory,
} from "../../../../../database/repositories";

import { TransactionRepositoryPG } from "../../../../../database/orm/pg/repositories";

import { CreatedResponder } from "../../../../responders/express/users";
import { addOrderValidator } from "../../../../validators/use-cases/orders";

import { DatabaseClient } from "@infra/database/orm";
import { Deliverer } from "../interfaces";

import { DatabaseConnection } from "../../../../../database/orm/interfaces";

import { Pool } from "pg";

export default class AddOrderDeliverer extends Deliverer {
  private db: DatabaseConnection;

  public constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);

    const databaseClient = DatabaseClient.getInstance();
    const newDb = databaseClient.getConnection();
    if (newDb) {
      this.db = newDb;
    } else {
      throw new Error("Database connection is not initialized.");
    }
  }

  public async IndexActionJSON(): Promise<void> {
    const usersRepositoryFactory = new UsersRepositoryFactory();
    const usersRepository = usersRepositoryFactory.create(
      process.env.DB_DIALECT!
    );

    const productsRepositoryFactory = new ProductsRepositoryFactory();
    const productsRepository = productsRepositoryFactory.create(
      process.env.DB_DIALECT!
    );

    const ordersRepositoryFactory = new OrdersRepositoryFactory();
    const ordersRepository = ordersRepositoryFactory.create(
      process.env.DB_DIALECT!
    );

    // Casting dan validasi tipe koneksi `Pool` untuk `TransactionRepositoryPG`
    if (!(this.db instanceof Pool)) {
      throw new Error(
        "Database connection is not a valid PostgreSQL Pool instance"
      );
    }

    const transactionRepository = new TransactionRepositoryPG(this.db);

    const createdResponder = new CreatedResponder(this.res);

    const addOrderController = new AddOrderController(
      ordersRepository,
      usersRepository,
      productsRepository,
      createdResponder,
      addOrderValidator,
      transactionRepository
    );

    const mappedHttpRequest = this.mapHttpRequest(this.req);

    try {
      await addOrderController.processRequest(mappedHttpRequest);
    } catch (err: any) {
      this.handleError(err);
    }
  }
}
