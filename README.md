# BookBeats: Immerse yourself to the beat of your story

## **What is it?**
BookBeats is a web app that generates Spotify playlists based on a book's theme using ChatGPT & Google Books. Simply insert the title, author, and song count (from 1 to 30) for a custom reading soundtrack.

## **About BookBeats**
After finishing Andy Weir’s ‘Artemis’ 🌖 and preparing to dive into ‘Project Hail Mary’ 🚀 (yes, I’m a huge Andy Weir fan 😎), the concept of BookBeats 🎵📚 struck me. Isn’t it wild how certain themes are intrinsically tied to a particular music? For my partner and me, the concept of ‘space’ is forever intertwined with the amazing soundtrack of ‘Interstellar’ 💫, composed by Hans Zimmer. It’s like a private concert in your mind while reading. This sparked my curiosity about the potential symbiosis between music, reading, and the immersive experience they both create together. Wait a minute — what if we could actually do that? What if we could have a curated playlist for a specific book reflecting its theme?

And so, BookBeats was born 🎉 It's a tool designed to amplify your reading experience. If you're one of those people who find music a catalyst to focus and dive into the story, this application is for you.

The MVP is straightforward, intuitive, and easy to navigate. Enter the title and author of the book you're currently hooked on, and let the application work its magic by connecting to Google Books API to find the book. Because seriously, unless it's your all-time favorite book, who has the time or memory to recall both the title AND the author's name? And let's not even get started on how to spell 'Fyodor Dostoevsky' correctly on the first try 🧐. Once the book is successfully tracked down, the app uses the ChatGPT API to curate a custom playlist of songs inspired by the book theme. And finally, it integrates with Spotify, allowing you to listen to the generated playlist while you devour your book.

Curious about the creative process behind BookBeats, from idea to MVP? [Read my latest blog post](https://medium.com/@marta.vila.garrido/bookbeats-hitting-the-right-note-my-first-ai-project-journey-from-idea-to-mvp-4b1f65c4adeb) for all the details.

## ⚠️ Important Update

BookBeats runs on OpenAI and Heroku credit. The credit limit has been reached, so the app will not generate more playlists.

But if you have your own OpenAI API Key, Google Books API Key and Spotify client ID and secret, feel free to test it locally!

## **Running BookBeats Locally**

Follow these steps to run BookBeats on your local machine:

**Prerequisites**
1. Node.js: You will need Node.js installed on your machine. You can download it from [Node.js](https://nodejs.org/en) official website.

2. You will need to have your own API keys for the OpenAI GPT-3 API, Google Books API, and Spotify API. Please refer to the corresponding official documentation on how to obtain these.

**Setup:**
1. Clone the repository to your local machine.

2. Navigate to the project directory in your terminal.

3. Install the necessary packages by running the following command:

```
npm install express node-fetch cors dotenv
```

4. Create a .env file in the root of the project with your OpenAI, Spotify and Google Books API keys:

```
OPENAIAPI_KEY = <Your OpenAI API Key>
SPOTIFY_CLIENT_ID = <Your Spotify Client ID>
SPOTIFY_CLIENT_SECRET = <Your Spotify Client Secret>
GOOGLEBOOKS_API_KEY = <Your Google Books API Key>
```

5. Once everything is set up, you can run the application from the root of the project using the following command:

```
node src/server/server.mjs
```

6. Open your web browser and go to http://localhost:3000.

7. Enjoy 🎉
