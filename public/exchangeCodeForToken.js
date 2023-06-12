import fetch from 'node-fetch';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = 'http://localhost:3000/callback';

const generateCodeChallenge = (codeVerifier) => {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
    return hash.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};

const codeVerifier = dotenv.config().parsed.CODE_VERIFIER;
const codeChallenge = generateCodeChallenge(codeVerifier);

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
                code_verifier: codeVerifier
            }),
        });

        const data = await response.json();
        return { accessToken: data.access_token, refreshToken: data.refresh_token };
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return null;
    }
};
