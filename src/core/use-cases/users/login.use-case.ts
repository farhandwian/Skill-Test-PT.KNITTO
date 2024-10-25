import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUsersGateway, ILoginRequestModel } from "../interfaces";
import { IUseCaseInputBoundary, IUseCaseOutputBoundary } from "../interfaces";
import { Result } from "../../lib/result";
import { User } from "../../entities";
import { NIL } from "uuid";

export default class LoginUseCase implements IUseCaseInputBoundary {
  private usersRepository: IUsersGateway;
  private presenter: IUseCaseOutputBoundary;

  public constructor(
    usersRepository: IUsersGateway,
    presenter: IUseCaseOutputBoundary
  ) {
    this.usersRepository = usersRepository;
    this.presenter = presenter;
  }

  public async execute(requestDetails: ILoginRequestModel): Promise<void> {
    try {
      const user = await this.usersRepository.findByUsername(
        requestDetails.username
      );
      if (!user) {
        throw Result.fail("User not found");
      }

      const isPasswordValid = bcrypt.compareSync(
        requestDetails.password,
        user.password
      );
      if (!isPasswordValid) {
        throw Result.fail("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "5h",
        }
      );
      const userDto = { username: user.username, token };

      this.presenter.execute(userDto);
    } catch (err: any) {
      throw Result.fail(err.message);
    }
  }
}
