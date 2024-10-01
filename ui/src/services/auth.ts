import { UserProfile } from "../../../common/types";
import { AUTH_STATUS, STORAGE_KEYS } from "../../../common/constants";

export const setAuthConfig = (user: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.USER_ID, String(user.id));
  localStorage.setItem(STORAGE_KEYS.USERNAME, String(user.username));
  localStorage.setItem(STORAGE_KEYS.PHOTO_URL, String(user.image));
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, String(user.accessToken));

  localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, AUTH_STATUS.CONNECTED);

  return true;
};

export const getAuthStatus = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_STATUS);
};

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

export const getCurrentUserUsername = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USERNAME);
};

export const getCurrentUserPicture = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.PHOTO_URL);
};

export const getCurrentUserAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.USERNAME);
  localStorage.removeItem(STORAGE_KEYS.PHOTO_URL);
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

  localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, AUTH_STATUS.UNAUTHENTICATED);

  return true;
};
