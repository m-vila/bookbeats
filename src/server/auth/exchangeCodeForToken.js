import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'https://bookbeats-187997a9d1fc.herokuapp.com/callback';

//Exchanges the authorization code for an access token and refresh token
export const exchangeCodeForToken = async (authorizationCode) => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret
            }),
        });

        const data = await response.json();
        return { accessToken: data.access_token, refreshToken: data.refresh_token };
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return null;
    }
};