import axios, { AxiosRequestConfig } from "axios";

import { getCurrentUserAccessToken, getCurrentUserId } from "../services/auth";
import {
  Assets,
  GetAssetsSuccessResponse,
  GlobalErrorResponse,
  LoginParams,
  LoginSuccessResponse,
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

const buildRequestConfig = (requestParams: any): AxiosRequestConfig<any> => {
  const accessToken = getCurrentUserAccessToken() || "";

  return {
    params: requestParams || null,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const generateErrorMessage = (error: GlobalErrorResponse): String => {
  const { response, status } = error;
  const errorMessage = response?.data?.message || ERROR_CODES.UNKNOWN;

  return String("Error ").concat(
    String(status),
    ": ",
    errorMessage.replace("_", " ")
  );
};

export const login = async (
  params: LoginParams
): Promise<UserProfile | String> => {
  return new Promise(async (resolve, reject) => {
    await axiosClient
      .post("login", params)
      .then((response: LoginSuccessResponse) => {
        const userData: UserProfile = response?.data;

        if (userData?.id && userData?.accessToken) {
          resolve(userData);
        }
      })
      .catch((error: GlobalErrorResponse) => {
        reject(generateErrorMessage(error));
      });
  });
};

export const getAssets = async (): Promise<Assets[] | String> => {
  return new Promise(async (resolve, reject) => {
    const userId = getCurrentUserId();
    const requestConfig = buildRequestConfig({
      userId: userId,
    });

    await axiosClient
      .get("assets", requestConfig)
      .then((response: GetAssetsSuccessResponse) => {
        const userAssets: Assets[] = response?.data;

        resolve(userAssets);
      })
      .catch((error: GlobalErrorResponse) => {
        reject(generateErrorMessage(error));
      });
  });
};
