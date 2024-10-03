import moment from "moment";
import axios, { AxiosRequestConfig } from "axios";

import {
  Asset,
  GetAssetsSuccessResponse,
  GetPortfolioSuccessResponse,
  GlobalErrorResponse,
  LoginParams,
  LoginSuccessResponse,
  Portfolio,
  AuthRequestQueryParams,
  UserProfile,
} from "../../../common/types";

import { ERROR_CODES } from "../../../common/constants";

import { getCurrentUserAccessToken, getCurrentUserId } from "../services/auth";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  },
});

const buildRequestConfig = (
  requestParams: AuthRequestQueryParams = {}
): AxiosRequestConfig<AuthRequestQueryParams> => {
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

export const getAssets = async (): Promise<Asset[] | String> => {
  return new Promise(async (resolve, reject) => {
    const requestConfig = buildRequestConfig();

    await axiosClient
      .get("assets", requestConfig)
      .then((response: GetAssetsSuccessResponse) => {
        const allAssets: Asset[] = response?.data;

        resolve(allAssets);
      })
      .catch((error: GlobalErrorResponse) => {
        reject(generateErrorMessage(error));
      });
  });
};

export const getPortfolio = async (): Promise<Portfolio | String> => {
  return new Promise(async (resolve, reject) => {
    const userId = getCurrentUserId() || "";
    const todayDate = moment().format("YYYY/MM/DD") || "";

    const requestConfig = buildRequestConfig({
      userId: userId,
      asOf: todayDate,
    });

    await axiosClient
      .get("portfolios", requestConfig)
      .then((response: GetPortfolioSuccessResponse) => {
        const userPortfolio: Portfolio = response?.data;

        resolve(userPortfolio);
      })
      .catch((error: GlobalErrorResponse) => {
        reject(generateErrorMessage(error));
      });
  });
};
