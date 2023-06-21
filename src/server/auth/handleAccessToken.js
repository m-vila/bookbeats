import { refreshAccessToken } from './refreshAccessToken.js';

let accessToken = null;
let tokenExpirationTime = null;
let refreshToken = null;

// Set access token, refresh token and calculate the token expiration time
export const setAccessToken = (newAccessToken, newRefreshToken, expiresIn) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  tokenExpirationTime = new Date().getTime() + expiresIn * 1000;
};

// Get the access token and handle token expiration
export const getAccessToken = async () => {
    //Check if token is still valid based on current time
  if (new Date().getTime() < tokenExpirationTime) {
    return accessToken;
  } else {
    await refreshAccessToken(refreshToken);
    return accessToken;
  }
};