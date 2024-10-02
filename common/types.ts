export type LoginParams = {
  username: string;
  password: string;
};

export type LoginRequest = {
  body: LoginParams;
};

export type LoginSuccessResponse = {
  status: Number;
  data: UserProfile;
};

export type GlobalErrorResponse = {
  status: Number;
  response: {
    data: {
      message: String;
    };
  };
};

export type LoginResponse = LoginSuccessResponse | GlobalErrorResponse;

export type UserProfile = {
  accessToken: String;
  email: String;
  id: Number;
  image: String;
  password?: String;
  refreshToken: String;
  username: String;
};

export type GetAssetsQueryParams = {
  userId: String;
};

export type GetAssetsSuccessResponse = {
  status: Number;
  data: Assets[];
};

export type GetAssetsErrorResponse = {
  status: Number;
  response: {
    data: {
      message: String;
    };
  };
};

export type GetAssetsResponse =
  | GetAssetsSuccessResponse
  | GetAssetsErrorResponse;

export enum AssetTypes {
  "fiat",
  "crypto",
  "stock",
}

export type Assets = {
  id: String;
  type: AssetTypes;
  name: String;
};

export type DbData = {
  users: UserProfile[];
  assets: {
    [id: string]: Assets[];
  };
};
