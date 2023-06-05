import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve(); 

const app = express();
const pathToEnv = path.resolve(process.cwd(), '../../.env');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config({path: pathToEnv});

const API_KEY = process.env.API_KEY;

app.post('/fetchData', async (req, res) => {
    const bookName = req.body.bookName;
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Suggest a playlist of 10 songs for the book ${bookName}`,
            max_tokens: 200,
            temperature: 0.5,
            stop: ["11."]
        })
    })
    const data = await response.json()
    res.json(data);
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});