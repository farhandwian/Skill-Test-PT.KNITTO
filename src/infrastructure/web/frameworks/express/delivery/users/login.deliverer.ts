import { Request, Response, NextFunction } from "express";
import { LoginController } from "@adapters/controllers/users";
import { UsersRepositoryFactory } from "../../../../../database/repositories";
import { OkResponder } from "../../../../responders/express/users";
import { loginValidator } from "../../../../validators/use-cases/users";
import { Deliverer } from "../interfaces";

export default class LoginDeliverer extends Deliverer {
  public constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  public async IndexActionJSON(): Promise<void> {
    console.log("Processing login request");
    const usersRepositoryFactory = new UsersRepositoryFactory();
    const usersRepository = usersRepositoryFactory.create(
      process.env.DB_DIALECT!
    );

    const successResponder = new OkResponder(this.res);

    const loginController = new LoginController(
      usersRepository,
      successResponder,
      loginValidator
    );

    const mappedHttpRequest = this.mapHttpRequest(this.req);

    try {
      await loginController.processRequest(mappedHttpRequest);
    } catch (err: any) {
      this.handleError(err);
    }
  }
}
