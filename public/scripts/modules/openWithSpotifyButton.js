import { displayError } from './displayError.js';

export const openWithSpotifyButton = async () => {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const spotifyLoginButton = document.getElementById('spotifyLoginButton');
    const openPlaylistButton = document.getElementById('openPlaylistWithSpotify');
    const spinner = document.getElementById('spinnerSpotifyPlaylist');

    openPlaylistButton.disabled = false;
    
    if (spotifyLoginButton.classList.contains('logged-in')) { 
        spotifyLoginButton.classList.remove('flashing');
        spinner.style.display = 'block';

        // Collects necessary data such as user profile, book name, and song information
        const userProfileResponse = await fetch('/user-profile');
        const userProfileData = await userProfileResponse.json();
        const userId = userProfileData.userId;
        const bookName = document.getElementById('bookName').value;

        // Extracts song title and author from chatGpt output
        const songElements = document.querySelectorAll('#chatGptOutput li');
        const songRegex = /"\s*([^"]+)"\s+by\s+([^\d]+)/g;
        const songs = Array.from(songElements).map(el => {
            songRegex.lastIndex = 0;
            const songText = el.textContent;
            const match = songRegex.exec(songText);
            if (match) {
                return {
                    title: match[1].trim(),
                    artist: match[2].trim()
                };
            }
            return null;
        }).filter(song => song !== null);

        // Searches for songs on Spotify and retrieves their URIs
        const songUris = [];
        const notFoundSongs = [];
        for (const song of songs) {
            const response = await fetch('https://your-heroku-app.herokuapp.com/search-song', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songTitle: song.title, songArtist: song.artist }),
            });

            const data = await response.json();
            if (data.uri) {
                songUris.push(data.uri);
            }  else {
                notFoundSongs.push(`${song.title} by ${song.artist}`);
            }
        }

        if (notFoundSongs.length > 0) {
            errorMessage.style.display = 'block';
            
            let notFoundList = '<ol>';
            for (let notFoundSong of notFoundSongs) {
                notFoundList += `<li>${notFoundSong}</li>`;
            }
            notFoundList += '</ol>';
            
            errorText.innerHTML = 'The following songs were not found on Spotify and could not be added to the playlist:<br>' + notFoundList;
        }               

        // Creates playlist on Spotify
        const createPlaylistResponse = await fetch('https://your-heroku-app.herokuapp.com/create-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, bookName }),
        });

        const createPlaylistData = await createPlaylistResponse.json();
        const playlistUrl = createPlaylistData.playlistUrl;
        const playlistId = createPlaylistData.playlistId;

        // Adds songs to the playlist
        await fetch('https://your-heroku-app.herokuapp.com/add-songs-to-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlistId, songUris }),
        });

        spinner.style.display = 'none';

        // Opens the playlist URL in a new tab
        window.open(playlistUrl, '_blank');
        openPlaylistButton.disabled = true;

    } else {
        displayError('Please log in with Spotify to create a playlist.');
        spotifyLoginButton.classList.add('flashing');
    }
};