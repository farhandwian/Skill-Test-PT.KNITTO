import { Result } from "../../lib/result";
import { Product } from "../../entities";
import { ProductMapper } from "../../mappers/product";
import IEntityMapper from "../../mappers/i-entity-mapper";
import { IProductDto } from "../../dtos/product";
import cron from "node-cron";
import { IUseCaseInputBoundary, IUseCaseOutputBoundary } from "../interfaces";
import { IProductsGateway } from "../interfaces";

export default class GetProductsUseCase implements IUseCaseInputBoundary {
  private productsRepository: IProductsGateway;
  private presenter: IUseCaseOutputBoundary;
  private dataMapper: IEntityMapper<Product, IProductDto>;

  public constructor(
    productsRepository: IProductsGateway,
    presenter: IUseCaseOutputBoundary
  ) {
    this.productsRepository = productsRepository;
    this.presenter = presenter;
    this.dataMapper = new ProductMapper();
  }

  // bayangkan sebuah skenario di mana produk-produk diperbarui secara otomatis dalam interval tertentu
  // untuk memastikan bahwa produk yang ada di sistem selalu sinkron dengan stok atau data yang diperbarui
  // (misalnya dari API eksternal, atau sinkronisasi dari sistem lain). Ini bisa menjadi implementasi cron job
  // yang berjalan di belakang layar.node-cron digunakan untuk menjadwalkan tugas ini, dan kemudian
  // memodifikasi GetProductsUseCase agar dapat menjalankan tugas tersebut secara otomatis pada interval tertentu,
  // misalnya setiap 10 menit.
  // Fungsi untuk menjadwalkan sinkronisasi
  public scheduleProductSync(): void {
    // Penjadwalan setiap 10 menit untuk sinkronisasi produk
    cron.schedule("*/10 * * * *", async () => {
      console.log("Running scheduled product synchronization...");

      try {
        // Panggil metode execute untuk mendapatkan dan memproses produk
        await this.execute();
        console.log("Product synchronization completed");
      } catch (err: any) {
        console.error("Failed to synchronize products:", err);
      }
    });
  }

  public async execute(): Promise<void> {
    try {
      const foundProducts = await this.productsRepository.findAll();

      const foundProductDTOs = foundProducts.map((p) =>
        this.dataMapper.toDTO(p)
      );

      this.presenter.execute(foundProductDTOs);
    } catch (err: any) {
      if (err.isFailure) throw err;

      throw Result.fail(err);
    }
  }
}
