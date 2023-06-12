import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let refreshToken = null;
let tokenExpirationTime = null;

export const setAccessToken = (newAccessToken, newRefreshToken, expiresIn) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    tokenExpirationTime = new Date().getTime() + expiresIn * 1000;
};

const refreshAccessToken = async () => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        const data = await response.json();
        setAccessToken(data.access_token, refreshToken, data.expires_in);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
};

export const getAccessToken = async () => {
    if (new Date().getTime() < tokenExpirationTime) {
        return accessToken;
    } else {
        await refreshAccessToken();
        return accessToken;
    }
};