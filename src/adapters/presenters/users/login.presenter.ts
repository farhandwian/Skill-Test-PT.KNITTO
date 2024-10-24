import { SuccessResponse } from "@common/contracts";
import { IUseCaseOutputBoundary } from "@core/use-cases/interfaces";
import { IResponder } from "../../controllers/interfaces";

export default class LoginPresenter implements IUseCaseOutputBoundary {
  private loginResponder: IResponder;

  public constructor(loginResponder: IResponder) {
    this.loginResponder = loginResponder;
  }

  public execute(responseModel: any): void {
    const successResponse = SuccessResponse.create(responseModel);
    this.loginResponder.respond(successResponse);
  }
}
