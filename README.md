# BookBeats: Immerse yourself to the beat of your story

## **What is it?**
BookBeats is a web app that generates Spotify playlists based on a book's theme using ChatGPT & Google Books. Simply insert the title, author, and song count (from 1 to 30) for a custom reading soundtrack.

## **About BookBeats**
After finishing Andy Weir’s ‘Artemis’ 🌖 and preparing to dive into ‘Project Hail Mary’ 🚀 (yes, I’m a huge Andy Weir fan 😎), the concept of BookBeats 🎵📚 struck me. Isn’t it wild how certain themes are intrinsically tied to a particular music? For my partner and me, the concept of ‘space’ is forever intertwined with the amazing soundtrack of ‘Interstellar’ 💫, composed by Hans Zimmer. It’s like a private concert in your mind while reading. This sparked my curiosity about the potential symbiosis between music, reading, and the immersive experience they both create together. Wait a minute — what if we could actually do that? What if we could have a curated playlist for a specific book reflecting its theme?

And so, BookBeats was born 🎉 It's a tool designed to amplify your reading experience. If you're one of those people who find music a catalyst to focus and dive into the story, this application is for you.

The MVP is straightforward, intuitive, and easy to navigate. Enter the title and author of the book you're currently hooked on, and let the application work its magic by connecting to Google Books API to find the book. Because seriously, unless it's your all-time favorite book, who has the time or memory to recall both the title AND the author's name? And let's not even get started on how to spell 'Fyodor Dostoevsky' correctly on the first try 🧐. Once the book is successfully tracked down, the app uses the ChatGPT API to curate a custom playlist of songs inspired by the book theme. And finally, it integrates with Spotify, allowing you to listen to the generated playlist while you devour your book.

Curious about the creative process behind BookBeats, from idea to MVP? [Read my latest blog post](https://medium.com/@marta.vila.garrido/bookbeats-hitting-the-right-note-my-first-ai-project-journey-from-idea-to-mvp-4b1f65c4adeb) for all the details.

## **Deployed version**

BookBeats is available as a web application on Heroku. 
You can access it by [clicking here](https://bookbeats-187997a9d1fc.herokuapp.com)

## ⚠️ Important: Spotify Account Integration

To export the generated playlist to your Spotify account, please follow these steps:

1. Email your Spotify account email address to martasflat@gmail.com.
2. Your email will be added to the user management section of BookBeats.
3. Access is limited to 25 users, for this reason, yours will remain active for a maximum of 24 hours.
4. Once enabled, you can log in and export playlists directly to your Spotify account.

Please note that BookBeats runs on OpenAI credit. When this credit limit is reached, the app will temporarily stop generating playlists.

Enjoy! 🎉
