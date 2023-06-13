import dotenv from 'dotenv';

dotenv.config();

let spotifyAccessToken = null;
let tokenExpirationTime = null;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const getSpotifyAccessToken = async () => {
    const fetch = (await import('node-fetch')).default;

    if (spotifyAccessToken && new Date().getTime() < tokenExpirationTime) {
        return spotifyAccessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    spotifyAccessToken = data.access_token;
    tokenExpirationTime = new Date().getTime() + data.expires_in * 1000;
    return spotifyAccessToken;
};

export { getSpotifyAccessToken };