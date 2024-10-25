import Entity from "./interfaces/entity.abstract";

interface IProductProps {
  name: string;
  description: string;
  price: number;
  quantity: number;
  color: string;
  meta: Record<string, any>;
}

export default class Product extends Entity<IProductProps> {
  private constructor(props: IProductProps, id: string | null) {
    super(props, id);
  }

  public static create(productData: IProductProps, id: string | null): Product {
    const {
      name,
      description,
      price = 0.0,
      color,
      quantity,
      meta = {},
    }: IProductProps = productData;

    return new Product({ name, description, price, quantity, color, meta }, id);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get color(): string {
    return this.props.color;
  }

  get meta(): Record<string, any> {
    return this.props.meta;
  }

  public decrementQuantity(): void {
    if (this.props.quantity > 0) {
      this.props.quantity -= 1;
    } else {
      throw new Error("Quantity cannot be less than zero.");
    }
  }
}
