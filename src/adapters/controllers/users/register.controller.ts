import { RegisterUseCase } from "@core/use-cases/users";
import { RegisterPresenter } from "../../presenters/users";
import {
  IUsersGateway,
  IRegisterRequestModel,
} from "@core/use-cases/interfaces";
import { IHttpRequestModel, IResponder, IValidator } from "../interfaces";

export default class RegisterController {
  private usersRepository: IUsersGateway;
  private registerPresenter: RegisterPresenter;
  private validation: IValidator;

  public constructor(
    usersRepository: IUsersGateway,
    registerResponder: IResponder,
    validation: IValidator
  ) {
    this.usersRepository = usersRepository;
    this.registerPresenter = new RegisterPresenter(registerResponder);
    this.validation = validation;
  }

  public async processRequest(req: IHttpRequestModel): Promise<void> {
    const requestValidated =
      await this.validation.validate<IRegisterRequestModel>(req.body);

    if (requestValidated.isFailure) {
      throw requestValidated;
    }

    const useCaseRequestModel = requestValidated.getValue()!;
    const registerUseCase = new RegisterUseCase(
      this.usersRepository,
      this.registerPresenter
    );

    await registerUseCase.execute(useCaseRequestModel);
  }
}
