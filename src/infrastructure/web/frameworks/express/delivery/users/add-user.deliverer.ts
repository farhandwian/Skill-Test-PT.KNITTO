import { Request, Response, NextFunction } from "express";

import { AddUserController } from "@adapters/controllers/users";
import { UsersRepositoryFactory } from "../../../../../database/repositories";
import { CreatedResponder } from "../../../../responders/express/users";
import { addUserValidator } from "../../../../validators/use-cases/users";

import { Deliverer } from "../interfaces";

export default class AddUserDeliverer extends Deliverer {
  public constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  public async IndexActionJSON(): Promise<void> {
    console.log("tes 7");
    const usersRepositoryFactory = new UsersRepositoryFactory();
    const usersRepository = usersRepositoryFactory.create(
      process.env.DB_DIALECT!
    );

    const createdResponder = new CreatedResponder(this.res);

    const addUserController = new AddUserController(
      usersRepository,
      createdResponder,
      addUserValidator
    );

    const mappedHttpRequest = this.mapHttpRequest(this.req);

    try {
      await addUserController.processRequest(mappedHttpRequest);
    } catch (err: any) {
      this.handleError(err);
    }
  }
}
