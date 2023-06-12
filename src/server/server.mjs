import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { exchangeCodeForToken } from './exchangeCodeForToken.js';
import { setAccessToken } from './handleAccessToken.js';

const app = express();
const __dirname = path.resolve(); 
const pathToEnv = path.resolve(__dirname, '.env');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config({path: pathToEnv});

app.get('/spotify-client-id', (req, res) => {
    res.send(process.env.SPOTIFY_CLIENT_ID);
});

app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    const tokens = await exchangeCodeForToken(authorizationCode);
    if (tokens && tokens.accessToken) {
        setAccessToken(tokens.accessToken, tokens.refreshToken, 3600);
        res.redirect('http://localhost:3000/');
    } else {
        res.status(500).send('Error during authorization');
    }
});

const API_KEY = process.env.OPENAIAPI_KEY;

app.post('/fetchData', async (req, res) => {
    try {
        const bookName = req.body.bookName;
        const numSongs = req.body.numSongs;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "You are a helpful assistant."
                }, {
                    role: "user",
                    content: `Suggest a playlist of ${numSongs} songs for the book ${bookName}. Show the list of songs only.`
                }],
                max_tokens: 500,
                temperature: 0.5
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});