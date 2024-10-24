import { Request, Response, NextFunction } from "express";
import { RegisterController } from "@adapters/controllers/users";
import { UsersRepositoryFactory } from "../../../../../database/repositories";
import { CreatedResponder } from "../../../../responders/express/users";
import { registerValidator } from "../../../../validators/use-cases/users";
import { Deliverer } from "../interfaces";

export default class RegisterDeliverer extends Deliverer {
  public constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  public async IndexActionJSON(): Promise<void> {
    console.log("Processing register request");
    const usersRepositoryFactory = new UsersRepositoryFactory();
    const usersRepository = usersRepositoryFactory.create(
      process.env.DB_DIALECT!
    );

    const createdResponder = new CreatedResponder(this.res);

    const registerController = new RegisterController(
      usersRepository,
      createdResponder,
      registerValidator
    );

    const mappedHttpRequest = this.mapHttpRequest(this.req);

    try {
      await registerController.processRequest(mappedHttpRequest);
    } catch (err: any) {
      this.handleError(err);
    }
  }
}
