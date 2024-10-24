import { JoiValidator } from "../validator-wrapper";
import {
  LoginSchema,
  RegisterSchema,
  AddUserSchema,
  GetUserByIdSchema,
  DeleteUserByIdSchema,
  UpdateUserSchema,
} from "../schemas/users";

export const registerValidator = new JoiValidator(RegisterSchema);
export const loginValidator = new JoiValidator(LoginSchema);
export const addUserValidator = new JoiValidator(AddUserSchema);
export const getUserByIdValidator = new JoiValidator(GetUserByIdSchema);
export const deleteUserByIdValidator = new JoiValidator(DeleteUserByIdSchema);
export const updateUserValidator = new JoiValidator(UpdateUserSchema);
