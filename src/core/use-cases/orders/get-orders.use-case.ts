import { Result } from "../../lib/result";

import {
  IOrdersGateway,
  IUseCaseInputBoundary,
  IUseCaseOutputBoundary,
} from "../interfaces";

export default class GetOrdersUseCase implements IUseCaseInputBoundary {
  private ordersRepository: IOrdersGateway;
  private presenter: IUseCaseOutputBoundary;

  public constructor(
    ordersRepository: IOrdersGateway,
    presenter: IUseCaseOutputBoundary
  ) {
    this.ordersRepository = ordersRepository;
    this.presenter = presenter;
  }

  public async execute(): Promise<void> {
    try {
      const foundOrders =
        await this.ordersRepository.findOrdersGroupByProducts();

      this.presenter.execute(foundOrders);
    } catch (err: any) {
      if (err.isFailure) throw err;

      throw Result.fail(err);
    }
  }
}
