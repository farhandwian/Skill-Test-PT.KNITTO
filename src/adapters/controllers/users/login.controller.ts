import { LoginUseCase } from "@core/use-cases/users";
import { LoginPresenter } from "../../presenters/users";
import { IUsersGateway, ILoginRequestModel } from "@core/use-cases/interfaces";
import { IHttpRequestModel, IResponder, IValidator } from "../interfaces";

export default class LoginController {
  private usersRepository: IUsersGateway;
  private loginPresenter: LoginPresenter;
  private validation: IValidator;

  public constructor(
    usersRepository: IUsersGateway,
    loginResponder: IResponder,
    validation: IValidator
  ) {
    this.usersRepository = usersRepository;
    this.loginPresenter = new LoginPresenter(loginResponder);
    this.validation = validation;
  }

  public async processRequest(req: IHttpRequestModel): Promise<void> {
    const requestValidated = await this.validation.validate<ILoginRequestModel>(
      req.body
    );

    if (requestValidated.isFailure) {
      throw requestValidated;
    }

    const useCaseRequestModel = requestValidated.getValue()!;
    const loginUseCase = new LoginUseCase(
      this.usersRepository,
      this.loginPresenter
    );

    await loginUseCase.execute(useCaseRequestModel);
  }
}
