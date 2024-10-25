import RouterMaker from "../interfaces/router.abstract";

import { AddOrderDeliverer } from "../../delivery/orders";
import { GetOrderByIdDeliverer } from "../../delivery/orders";
import { GetOrdersDeliverer } from "../../delivery/orders";
import { UpdateOrderDeliverer } from "../../delivery/orders";
import { DeleteOrderDeliverer } from "../../delivery/orders";
import { authenticate } from "../../middlewares/authentication";

export default class OrdersRouter extends RouterMaker {
  public constructor() {
    super();
    this.initRoutes();
  }

  private initRoutes(): void {
    // this._router.get("/:id", this.makeRequestHandler(GetOrderByIdDeliverer));

    this._router.get(
      "/laporan/get-product-order-counts",
      this.makeRequestHandler(GetOrdersDeliverer)
    );

    this._router.post(
      "/",
      authenticate,
      this.makeRequestHandler(AddOrderDeliverer)
    );

    // this._router.patch("/:id", this.makeRequestHandler(UpdateOrderDeliverer));

    // this._router.delete("/:id", this.makeRequestHandler(DeleteOrderDeliverer));
  }
}
