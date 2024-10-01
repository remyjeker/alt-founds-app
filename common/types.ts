export type LoginParams = {
  username: string;
  password: string;
};

export type LoginRequest = {
  body: LoginParams;
};

export type LoginResponse = {
  status: Number;
  data?: UserProfile;
  response?: {
    data?: {
      message?: String;
    };
  };
};

export type UserProfile = {
  accessToken: String;
  email: String;
  id: Number;
  image: String;
  password?: String;
  refreshToken: String;
  username: String;
};

// ASSETS

export type GetAssetsQueryParams = {
  userId: String;
};

export type GetAssetsResponse = {
  status: Number;
  data?: Assets[];
  response?: {
    data?: {
      message?: String;
    };
  };
};

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

// DB

export type DbData = {
  users: UserProfile[];
  assets: {
    [id: string]: Assets[];
  };
};
