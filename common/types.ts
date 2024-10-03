export type LoginParams = {
  username: string;
  password: string;
};

export type LoginRequest = {
  body: LoginParams;
};

export type LoginSuccessResponse = {
  status: number;
  data: UserProfile;
};

export type GlobalErrorResponse = {
  status: number;
  response: {
    data: {
      message: string;
    };
  };
};

export type LoginResponse = LoginSuccessResponse | GlobalErrorResponse;

export type UserProfile = {
  accessToken: string;
  email: string;
  id: number;
  image: string;
  password?: string;
  refreshToken: string;
  username: string;
};

export type AuthRequestQueryParams = {
  userId?: string;
  asOf?: string;
};

export type GetAssetsSuccessResponse = {
  status: number;
  data: Asset[];
};

export type GetAssetsErrorResponse = {
  status: number;
  response: {
    data: {
      message: string;
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
  id: string;
  type: AssetTypes;
  name: string;
};

export type DbData = {
  users: UserProfile[];
  assets: Asset[];
  portfolios: {
    [id: string]: Portfolio;
  };
};

export type GetPortfolioQueryParams = {
  userId: string;
};

export type GetPortfolioSuccessResponse = {
  status: number;
  data: Portfolio;
};

export type Position = {
  id: string;
  asset: string;
  quantity: number;
  asOf: number;
  price: number;
};

export type Portfolio = {
  id: string;
  asOf: number;
  positions: Position[];
};
