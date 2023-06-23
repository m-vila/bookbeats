import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { exchangeCodeForToken } from './auth/exchangeCodeForToken.js';
import { setAccessToken } from './auth/handleAccessToken.js';
import { getAccessToken } from './auth/handleAccessToken.js';

const app = express();
const __dirname = path.resolve(); 
const pathToEnv = path.resolve(__dirname, '.env');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load environment variables from .env file
dotenv.config({path: pathToEnv});

const API_KEY = process.env.OPENAI_API_KEY;
const GOOGLEBOOKS_API_KEY = process.env.GOOGLEBOOKS_API_KEY;

// Fetch data from the Google Books API for the autocomplete feature
app.get('/autocomplete', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLEBOOKS_API_KEY}`);
        const data = await response.json();

        // Extract book title, author and thumbnail from the API response
        const items = data.items.map(item => ({
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            thumbnail: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.smallThumbnail : null
        }));
        res.json({items});
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Generate playlist using OpenAI GPT-3 model
app.post('/fetch-chat-gpt-response', async (req, res) => {
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

// Get the Spotify client ID
app.get('/spotify-client-id', (req, res) => {
    res.send(process.env.SPOTIFY_CLIENT_ID);
});

// Handle the callback from Spotify authentication
app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    const tokens = await exchangeCodeForToken(authorizationCode);
    if (tokens && tokens.accessToken) {
        // Set the access token and refresh token in the server
        setAccessToken(tokens.accessToken, tokens.refreshToken, 3600);
        res.redirect('https://bookbeats-187997a9d1fc.herokuapp.com');
    } else {
        res.status(500).send('Error during authorization');
    }
});

// Get the user profile from Spotify
app.get('/user-profile', async (req, res) => {
    const accessToken = await getAccessToken();
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        res.json({ profile: data, userId: data.id });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a playlist on Spotify
app.post('/create-playlist', async (req, res) => {
    const userId = req.body.userId;
    const accessToken = await getAccessToken();
    const bookName = req.body.bookName;
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${bookName} Playlist`,
                description: 'A playlist created by BookBeats, inspired by your favorite book.',
                public: false
            })
        });

        const data = await response.json();
        res.json({ playlistId: data.id, playlistUrl: data.external_urls.spotify });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Search for a song on Spotify
const searchForSong = async (songTitle, songArtist, accessToken) => {
    try {
        const query = encodeURIComponent(`${songTitle} artist:${songArtist}`);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        const tracks = data.tracks.items;
        if (tracks.length > 0) {
            return tracks[0].uri;
        }
    } catch (error) {
        console.error('Error searching for song:', error);
    }
    return null;
};

// Search for a song and return its URI
app.post('/search-song', async (req, res) => {
    const songTitle = req.body.songTitle;
    const songArtist = req.body.songArtist;
    const accessToken = await getAccessToken();

    const uri = await searchForSong(songTitle, songArtist, accessToken);

    res.json({ uri });
});

// Add songs to a playlist on Spotify
app.post('/add-songs-to-playlist', async (req, res) => {
    const playlistId = req.body.playlistId;
    const songUris = req.body.songUris;
    const accessToken = await getAccessToken();

    try {
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: songUris
            })
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding songs to playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});