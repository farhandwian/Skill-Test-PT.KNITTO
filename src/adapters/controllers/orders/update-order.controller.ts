import { UpdateOrderUseCase } from "@core/use-cases/orders";
import { UpdateOrderPresenter } from "@adapters/presenters/orders";

import {
  IUsersGateway,
  IProductsGateway,
  IOrdersGateway,
  IUpdateOrderRequestModel,
} from "@core/use-cases/interfaces";
import { IResponder, IValidator, IHttpRequestModel } from "../interfaces";

export default class UpdateOrderController {
  private ordersRepo: IOrdersGateway;
  private userRepo: IUsersGateway;
  private productRepo: IProductsGateway;

  private UpdateOrderPresenter: UpdateOrderPresenter;
  private validation: IValidator;

  public constructor(
    ordersRepo: IOrdersGateway,
    userRepo: IUsersGateway,
    productRepo: IProductsGateway,
    createdResponder: IResponder,
    validation: IValidator
  ) {
    this.ordersRepo = ordersRepo;
    this.userRepo = userRepo;
    this.productRepo = productRepo;

    this.UpdateOrderPresenter = new UpdateOrderPresenter(createdResponder);
    this.validation = validation;
  }

  async processRequest(req: IHttpRequestModel): Promise<void> {
    const requestValidated =
      await this.validation.validate<IUpdateOrderRequestModel>({
        id: req.params.id,
        orderDetails: req.body,
      });

    if (requestValidated.isFailure) {
      throw requestValidated;
    }

    const useCaseRequestModel = requestValidated.getValue()!;

    const updateOrderUseCase = new UpdateOrderUseCase(
      this.ordersRepo,
      this.userRepo,
      this.productRepo,
      this.UpdateOrderPresenter
    );

    await updateOrderUseCase.execute(useCaseRequestModel);
  }
}
