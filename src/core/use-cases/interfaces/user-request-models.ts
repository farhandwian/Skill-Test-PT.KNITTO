interface IUserID {
  id: string;
}

export interface IUserDetails {
  firstName: string;
  lastName: string;
  meta: {
    [key: string]: any;
  };
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUserRegister extends IUserDetails {
  username: string;
  password: string;
}

export interface IRegisterRequestModel extends IUserRegister {}

export interface ILoginRequestModel extends IUserLogin {}

export interface IAddUserRequestModel extends IUserDetails {}

export interface IDeleteUserRequestModel extends IUserID {}

export interface IGetUserByIdRequestModel extends IUserID {}

export interface IUpdateUserRequestModel extends IUserID {
  userDetails: IUserDetails;
}
