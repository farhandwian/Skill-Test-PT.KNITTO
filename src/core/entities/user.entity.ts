import Entity from "./interfaces/entity.abstract";

interface IUserProps {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  meta: Record<string, any>;
}

export default class User extends Entity<IUserProps> {
  private constructor(props: IUserProps, id: string | null) {
    super(props, id);
  }

  public static create(userData: IUserProps, id: string | null): User {
    const { firstName, lastName, username, password, meta = {} } = userData;

    return new User({ firstName, lastName, username, password, meta }, id);
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get username(): string {
    return this.props.username;
  }

  get password(): string {
    return this.props.password;
  }

  get meta(): Record<string, any> {
    return this.props.meta;
  }
}
