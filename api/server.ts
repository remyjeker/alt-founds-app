import express from "express";
import cors from "cors";
import { JSONFilePreset } from "lowdb/node";

import {
  Assets,
  DbData,
  GetAssetsQueryParams,
  LoginRequest,
  UserProfile,
} from "../common/types";

import { ERROR_CODES, ERROR_STATUS } from "../common/constants";

const API_PORT = 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:8100", "*"],
  })
);

const defaultData: DbData = { users: [], assets: {} };

const db = await JSONFilePreset<DbData>("db.json", defaultData);

const getUser = (
  users: UserProfile[],
  username: String
): UserProfile | null => {
  return users.find((user: UserProfile) => user.username === username) || null;
};

const isPasswordMatching = (user: UserProfile, password: String): Boolean => {
  return Boolean(user.password === password);
};

// WARNING : DUMMY TOKEN VERIFICATION
const accessTokenVerifificationFromResourceServer = (
  requestHeader: express.Request.headers
) => {
  return Boolean(
    String(requestHeader?.authorization).includes(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    )
  );
};

// WARNING : DUMMY LOGIN FEATURE
app.post("/api/login", async (req: express.Request, res: express.Response) => {
  const { body: userCredentials }: LoginRequest = req;

  const { users }: DbData = db.data;

  const userExists = getUser(users, userCredentials.username);

  if (userExists) {
    if (isPasswordMatching(userExists, userCredentials.password)) {
      const { password, ...userPublicProps }: UserProfile = userExists;

      return res.json(userPublicProps);
    } else {
      return res.status(ERROR_STATUS.UNAUTHORIZED).json({
        message: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }
  }

  return res.status(ERROR_STATUS.UNAUTHORIZED).json({
    message: ERROR_CODES.UNKNOWN_USER,
  });
});

// GET USER'S ASSETS
app.get("/api/assets", async (req: express.Request, res: express.Response) => {
  const hasValidToken = accessTokenVerifificationFromResourceServer(
    req.headers
  );

  if (!hasValidToken) {
    return res.status(ERROR_STATUS.UNAUTHORIZED).json({
      message: ERROR_CODES.UNAUTHORIZED,
    });
  }

  const { userId }: GetAssetsQueryParams = req.query;

  const { assets }: DbData = db.data;

  const userAssets: Assets[] | null = assets[String(userId)] || null;

  if (!userAssets) {
    return res.status(ERROR_STATUS.NOT_FOUND).json({
      message: ERROR_CODES.NOT_FOUND,
    });
  }

  return res.json(userAssets);
});

app.listen(API_PORT, () => {
  console.log(`API running on port: ${API_PORT}`);
});
