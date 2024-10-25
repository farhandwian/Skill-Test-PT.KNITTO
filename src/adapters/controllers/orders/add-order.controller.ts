import { AddOrderUseCase } from "@core/use-cases/orders";
import { AddOrderPresenter } from "../../presenters/orders";
import {
  IAddOrderRequestModel,
  IUsersGateway,
  IProductsGateway,
  IOrdersGateway,
} from "@core/use-cases/interfaces";
import { IResponder, IValidator, IHttpRequestModel } from "../interfaces";
import TransactionRepository from "../../../infrastructure/database/orm/pg/repositories/transaction.repository";

export default class AddOrderController {
  private ordersRepo: IOrdersGateway;
  private userRepo: IUsersGateway;
  private productRepo: IProductsGateway;
  private addOrderPresenter: AddOrderPresenter;
  private validation: IValidator;
  private transactionRepository: TransactionRepository;

  public constructor(
    ordersRepo: IOrdersGateway,
    userRepo: IUsersGateway,
    productRepo: IProductsGateway,
    createdResponder: IResponder,
    validation: IValidator,
    transactionRepository: TransactionRepository
  ) {
    this.ordersRepo = ordersRepo;
    this.userRepo = userRepo;
    this.productRepo = productRepo;
    this.addOrderPresenter = new AddOrderPresenter(createdResponder);
    this.validation = validation;
    this.transactionRepository = transactionRepository;
  }

  public async processRequest(req: IHttpRequestModel): Promise<void> {
    // Validate the request body
    const requestValidated =
      await this.validation.validate<IAddOrderRequestModel>(req.body);

    // If validation fails, throw the error
    if (requestValidated.isFailure) {
      throw requestValidated;
    }

    // Extract the validated data from the request
    const useCaseRequestModel = requestValidated.getValue()!;

    // Create the AddOrderUseCase with the necessary repositories
    const addOrderUseCase = new AddOrderUseCase(
      this.ordersRepo,
      this.userRepo,
      this.productRepo,
      this.addOrderPresenter,
      this.transactionRepository
    );

    // Execute the use case with the validated data
    await addOrderUseCase.execute(useCaseRequestModel);
  }
}
