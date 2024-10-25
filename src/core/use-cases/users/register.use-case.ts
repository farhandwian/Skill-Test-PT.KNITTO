import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUsersGateway, IRegisterRequestModel } from "../interfaces";
import { IUseCaseInputBoundary, IUseCaseOutputBoundary } from "../interfaces";
import { Result } from "../../lib/result";
import { User } from "../../entities";

export default class RegisterUseCase implements IUseCaseInputBoundary {
  private usersRepository: IUsersGateway;
  private presenter: IUseCaseOutputBoundary;

  public constructor(
    usersRepository: IUsersGateway,
    presenter: IUseCaseOutputBoundary
  ) {
    this.usersRepository = usersRepository;
    this.presenter = presenter;
  }

  public async execute(requestDetails: IRegisterRequestModel): Promise<void> {
    try {
      const existingUser = await this.usersRepository.findByUsername(
        requestDetails.username
      );
      if (existingUser) {
        throw Result.fail("Username already exists");
      }

      const hashedPassword = await bcrypt.hash(requestDetails.password, 10);
      const newUser = User.create(
        {
          firstName: requestDetails.firstName,
          lastName: requestDetails.lastName,
          username: requestDetails.username,
          password: hashedPassword,
          meta: {},
        },
        null
      );

      const savedUser = await this.usersRepository.save(newUser);

      const token = jwt.sign(
        { id: savedUser.id, username: savedUser.username },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "1h",
        }
      );

      const userDto = { username: savedUser.username, token };

      this.presenter.execute(userDto);
    } catch (err: any) {
      throw Result.fail(err.message);
    }
  }
}
