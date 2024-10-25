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

    // ennpoint untuk soal no 7 (Buat endpoint yang mengembalikan sebuah data laporan, contoh kasusnya bisa menggunakan salah satu dari contoh di bawah ini atau contoh kasus yang ditentukan sendiri.)
    this._router.get(
      "/laporan/get-product-order-counts",
      this.makeRequestHandler(GetOrdersDeliverer)
    );

    // endpoint untuk soal no 6 (Buat endpoint yang menggunakan transaction ketika mengeksekusi lebih dari 2 query.)
    this._router.post(
      "/",
      authenticate,
      this.makeRequestHandler(AddOrderDeliverer)
    );

    // this._router.patch("/:id", this.makeRequestHandler(UpdateOrderDeliverer));

    // this._router.delete("/:id", this.makeRequestHandler(DeleteOrderDeliverer));
  }
}
