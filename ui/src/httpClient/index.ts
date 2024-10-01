import axios from "axios";

import { getCurrentUserAccessToken, getCurrentUserId } from "../services/auth";
import {
  Assets,
  GetAssetsResponse,
  LoginParams,
  LoginResponse,
  UserProfile,
} from "../../../common/types";
import { ERROR_CODES } from "../../../common/constants";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  },
});

export const login = async (
  params: LoginParams
): Promise<UserProfile | String> => {
  return new Promise(async (resolve, reject) => {
    await axiosClient
      .post("login", params)
      .then((response: LoginResponse) => {
        const userData: UserProfile | undefined = response?.data;

        if (userData?.id && userData?.accessToken) {
          resolve(userData);
        }
      })
      .catch((error: LoginResponse) => {
        const { response, status } = error;
        const errorMessage = response?.data?.message || ERROR_CODES.UNKNOWN;

        reject(
          String("Error ").concat(
            String(status),
            ": ",
            errorMessage.replace("_", " ")
          )
        );
      });
  });
};

export const getAssets = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const userId = getCurrentUserId();
    const accessToken = getCurrentUserAccessToken();
    const requestConfig = {
      params: {
        userId: userId,
      },
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    await axiosClient
      .get("assets", requestConfig)
      .then((response: GetAssetsResponse) => {
        const userAssets: Assets[] | undefined = response?.data;

        resolve(userAssets);
      })
      .catch((error: GetAssetsResponse) => {
        const { response, status } = error;
        const errorMessage = response?.data?.message || ERROR_CODES.UNKNOWN;

        reject(
          String("Error ").concat(
            String(status),
            ": ",
            errorMessage.replace("_", " ")
          )
        );
      });
  });
};
