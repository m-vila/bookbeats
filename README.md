# BookBeats: Immerse yourself to the beat of your story

## **About BookBeats**

Having just finished Andy Weir's 'Artemis' 🌖 and as I was getting ready for 'Project Hail Mary' 🚀 (yeah, I'm a huge Andy Weir fan 😎), the concept of BookBeats 🎵📚 struck me. Isn't it wild how certain themes are intrinsically tied to a particular music? For me, the concept of 'space' is forever intertwined with the amazing soundtrack of 'Interstellar' 💫, composed by Hans Zimmer. It's like a private concert in my mind while reading. This sparked curiosity about the potential symbiosis between music, reading, and the immersive experience they both create together. Hang on - what if we could actually do it? What if we could have a curated playlist for a specific book reflecting its theme?

And so, BookBeats was born 🎉. It's a tool designed to amplify your reading experience. If you're one of those people who find music a catalyst to focus and dive into the story, this application is for you.

The MVP is simple, intuitive, and easy to navigate. Enter the title and author of the book you're currently hooked on, and let the application work its magic by connecting to the Goodreads API to find the book. Because seriously, unless it's your all-time favorite book, who has the time or memory to recall both the title AND the author's name? And let's not even get started on how to spell 'Fyodor Dostoevsky' correctly on the first try 🧐. Once the book is successfully tracked down, the app uses the ChatGPT API to curate a custom playlist of songs inspired by the book theme. And finally, it integrates with Spotify, allowing you to listen to the generated playlist while you devour your book.


## **Running BookBeats Locally**

Follow these steps to run BookBeats on your local machine:

**Prerequisites**
1. Node.js: You will need Node.js installed on your machine. You can download it from [Node.js](https://nodejs.org/en) official website.

2. You will need to have your own API keys for the OpenAI GPT-3 API, Goodreads API, and Spotify API. Please refer to the corresponding official documentation on how to obtain these.

**Setup:**
1. Clone the repository to your local machine.

2. Navigate to the project directory in your terminal.

3. Install the necessary packages by running the following command:

```
npm install
npm install express node-fetch cors dotenv
```

4. Update the server.mjs file with your own API keys:

```
const OPENAI_API_KEY = "<Your OpenAI API Key>";
const GOODREADS_API_KEY = "<Your Goodreads API Key>";
const SPOTIFY_API_KEY = "<Your Spotify API Key>";
```

5. Once everything is set up, you can run the application using the following command:

```
node server.mjs
```

6. Open your web browser and go to http://localhost:3000. You can also double click on the index.html file from the folder.

7. Enjoy BookBeats! Enter your favorite book and it will create a personalized playlist for you.

## **Conclusion**

BookBeats is an initiative that aims to bridge the immersive worlds of literature and music 🎶📖. This is just an MVP and I will continue working on it based on user feedback to enrich the reader's experience. Whether you're a fan of science fiction 👽, romance ❤️, mystery 🕵️‍♀️, or any other genre, I hope BookBeats will enhance your reading journey, making it even more enjoyable 🥳.
