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

export type AuthRequestQueryParams = {
  userId?: String;
  asOf?: String;
};

export type GetAssetsSuccessResponse = {
  status: Number;
  data: Asset[];
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

export type Asset = {
  id: String;
  type: AssetTypes;
  name: String;
};

export type DbData = {
  users: UserProfile[];
  assets: Asset[];
  portfolios: {
    [id: string]: Portfolio;
  };
};

export type GetPortfolioQueryParams = {
  userId: String;
};

export type GetPortfolioSuccessResponse = {
  status: Number;
  data: Portfolio;
};

export type Position = {
  id: String;
  asset: String;
  quantity: Number;
  asOf: String;
  price: Number;
};

export type Portfolio = {
  id: String;
  asOf: String;
  positions: Position[];
};
