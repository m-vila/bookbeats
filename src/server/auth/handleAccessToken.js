import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { refreshAccessToken } from './refreshAccessToken.js';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpirationTime = null;
let refreshToken = null;

export const setAccessToken = (newAccessToken, newRefreshToken, expiresIn) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  tokenExpirationTime = new Date().getTime() + expiresIn * 1000;
};

export const getAccessToken = async () => {
  if (new Date().getTime() < tokenExpirationTime) {
    return accessToken;
  } else {
    await refreshAccessToken(refreshToken);
    return accessToken;
  }
};