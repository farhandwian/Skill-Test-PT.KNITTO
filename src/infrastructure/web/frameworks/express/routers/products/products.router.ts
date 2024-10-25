import RouterMaker from "../interfaces/router.abstract";

import { AddProductDeliverer } from "../../delivery/products";
import { GetProductByIdDeliverer } from "../../delivery/products";
import { GetProductsDeliverer } from "../../delivery/products";
import { UpdateProductDeliverer } from "../../delivery/products";
import { DeleteProductDeliverer } from "../../delivery/products";

export default class ProductsRouter extends RouterMaker {
  public constructor() {
    super();
    this.initRoutes();
  }

  private initRoutes(): void {
    // this._router.get("/:id", this.makeRequestHandler(GetProductByIdDeliverer));

    // endpoint untuk soal no 5 (Buat contoh backend yang mengelola proses penjadwalan sebuah task secara sederhana.)
    this._router.get("/", this.makeRequestHandler(GetProductsDeliverer));

    // endpoint untuk soal no 2 (Buat endpoint yang menyimpan data tertentu, data tersebut memiliki sebuah kode unik dan memiliki running number, buatkan juga penanganan ketika terjadi race condition)
    this._router.post("/", this.makeRequestHandler(AddProductDeliverer));

    // this._router.patch(
    //   '/:id',
    //   this.makeRequestHandler(UpdateProductDeliverer)
    // );

    // this._router.delete(
    //   '/:id',
    //   this.makeRequestHandler(DeleteProductDeliverer)
    // );
  }
}
