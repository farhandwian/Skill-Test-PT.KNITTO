import { SuccessResponse } from "@common/contracts";
import { IUseCaseOutputBoundary } from "@core/use-cases/interfaces";
import { IResponder } from "../../controllers/interfaces";

export default class RegisterPresenter implements IUseCaseOutputBoundary {
  private registerResponder: IResponder;

  public constructor(registerResponder: IResponder) {
    this.registerResponder = registerResponder;
  }

  public execute(responseModel: any): void {
    const successResponse = SuccessResponse.create(responseModel);
    this.registerResponder.respond(successResponse);
  }
}
