import { Result } from "../../lib/result";
import { Order, Product } from "../../entities";
import { ValidationError } from "@common/errors";
import { OrderMapper } from "../../mappers/order";
import IEntityMapper from "../../mappers/i-entity-mapper";
import { IOrderDto } from "../../dtos/order";
import { ITransactionRepository } from "../../../infrastructure/database/orm/pg/repositories/transaction.repository";
import { PoolClient } from "pg";
import { IUseCaseInputBoundary, IUseCaseOutputBoundary } from "../interfaces";
import { IProductsGateway, IUsersGateway, IOrdersGateway } from "../interfaces";
import { IAddOrderRequestModel } from "../interfaces";

interface IValidationError {
  field: string;
  msg: string;
}

export default class AddOrderUseCase implements IUseCaseInputBoundary {
  private ordersRepository: IOrdersGateway;
  private usersRepository: IUsersGateway;
  private productsRepository: IProductsGateway;
  private presenter: IUseCaseOutputBoundary;
  private dataMapper: IEntityMapper<Order, IOrderDto>;
  private transactionRepository: ITransactionRepository;

  public constructor(
    ordersRepository: IOrdersGateway,
    usersRepository: IUsersGateway,
    productsRepository: IProductsGateway,
    presenter: IUseCaseOutputBoundary,
    transactionRepository: ITransactionRepository
  ) {
    this.ordersRepository = ordersRepository;
    this.usersRepository = usersRepository;
    this.productsRepository = productsRepository;
    this.presenter = presenter;
    this.dataMapper = new OrderMapper();
    this.transactionRepository = transactionRepository;
  }

  public async execute(requestModel: IAddOrderRequestModel): Promise<void> {
    const { userId, productIds, date, isPaid, meta } = requestModel;

    const order = Order.create(
      {
        userId,
        productIds,
        date,
        isPaid,
        meta,
      },
      null
    );
    console.log("ini product id" + order.productIds);

    console.log("ini product id" + order.productIds);
    let client: PoolClient | null = null;

    try {
      const validationErrors = await this.getValidationErrors(order);

      if (validationErrors.length > 0) {
        const invalid = new ValidationError("Validation Errors");
        invalid.reason = "Bad data";
        invalid.validationErrors = validationErrors;
        throw invalid;
      }
      client = await this.transactionRepository.beginTransaction();

      const addedOrder = await this.ordersRepository.save(order);
      const addedOrderDto = this.dataMapper.toDTO(addedOrder);

      await this.updateProductQuantities(order.productIds, client);

      await this.transactionRepository.commitTransaction(client);

      this.presenter.execute(addedOrderDto);
    } catch (err: any) {
      if (client) {
        await this.transactionRepository.rollbackTransaction(client);
      }
      if (err.isFailure) throw err;
      throw Result.fail(err);
    } finally {
      if (client) {
        this.transactionRepository.releaseClient(client);
      }
    }
  }

  /**
   * Update kuantitas produk berdasarkan productIds dalam konteks transaksi.
   * @param productIds ID produk yang dipesan
   * @param client Koneksi database untuk transaksi
   */
  private async updateProductQuantities(
    productIds: string[],
    client: PoolClient
  ): Promise<void> {
    console.log("Product IDs: ", productIds);

    const products = await Promise.all(
      productIds.map((id) => this.productsRepository.findOne(id, client))
    );

    console.log("Products found:", products);

    for (const product of products) {
      if (product) {
        console.log("product.quantity 1:" + product.quantity);
        product.decrementQuantity();

        console.log("product.quantity 2:" + product.quantity);

        // Create a new Product instance with updated values
        const updatedProduct = Product.create(
          {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            color: product.color,
            meta: product.meta,
          },
          product.id // Pass the existing product ID to maintain its identity
        );

        await this.productsRepository.update(
          updatedProduct, // Pass the Product instance
          { id: product.id }, // Update criteria
          client
        );
      }
    }

    console.log("Product quantities updated successfully.");
  }

  private async getValidationErrors(order: Order): Promise<IValidationError[]> {
    const notFoundProductIds = await this.getProductIdValidationErrors(order);

    const notFoundUserId = await this.getUserIdValidationError(order);

    return [...notFoundProductIds, ...notFoundUserId];
  }

  private async getProductIdValidationErrors(
    order: Order
  ): Promise<IValidationError[]> {
    const productIds = order.productIds as string[];
    console.log("tes getProductIdValidationErrors 1");
    const getProductsById = productIds.map((id: string) => {
      return this.productsRepository.findOne(id);
    });

    console.log("tes getProductIdValidationErrors 2");
    const foundProducts = await Promise.all(getProductsById);

    const invalidProductIds = foundProducts.reduce(
      (accum: string[], currentVal: Product | null, i: number) => {
        if (currentVal === null) accum.push(productIds[i]);
        return accum;
      },
      []
    );

    if (invalidProductIds.length === 0) return [] as IValidationError[];

    const returnable = [] as IValidationError[];

    returnable.push({
      field: "productIds",
      msg: `No products with ids ${invalidProductIds.join(", ")}`,
    });

    return returnable;
  }

  private async getUserIdValidationError(
    order: Order
  ): Promise<IValidationError[]> {
    const { userId } = order;

    const foundUser = await this.usersRepository.findOne(userId);

    if (foundUser) return [] as IValidationError[];

    const returnable = [] as IValidationError[];

    returnable.push({
      field: "userId",
      msg: `No user with id ${userId}`,
    });

    return returnable;
  }
}
