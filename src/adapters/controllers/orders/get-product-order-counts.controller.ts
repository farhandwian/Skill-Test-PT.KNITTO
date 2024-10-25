import { GetProductOrderCountsUseCase } from "@core/use-cases/orders";
import { GetProductOrderCountsPresenter } from "@adapters/presenters/orders";

import { IOrdersGateway } from "@core/use-cases/interfaces";
import { IResponder, IHttpRequestModel } from "../interfaces";

export default class GetProductOrderCountsController {
  private ordersRepository: IOrdersGateway;
  private getOrdersPresenter: GetProductOrderCountsPresenter;

  public constructor(
    ordersRepository: IOrdersGateway,
    okResponder: IResponder
  ) {
    this.ordersRepository = ordersRepository;
    this.getOrdersPresenter = new GetProductOrderCountsPresenter(okResponder);
  }

  async processRequest(req: IHttpRequestModel): Promise<void> {
    const getOrdersUseCase = new GetProductOrderCountsUseCase(
      this.ordersRepository,
      this.getOrdersPresenter
    );

    await getOrdersUseCase.execute();
  }
}
