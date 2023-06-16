export const openWithSpotifyButton = async () => {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const spotifyLoginButton = document.getElementById('spotifyLoginButton');
    const openPlaylistButton = document.getElementById('openPlaylistWithSpotify');
    const spinner = document.getElementById('spinnerSpotifyPlaylist');

    openPlaylistButton.disabled = false;

    // Check if the user is logged in
    const loginStatusResponse = await fetch('/is-logged-in');
    const loginStatusData = await loginStatusResponse.json();
    const isLoggedIn = loginStatusData.isLoggedIn;
    
    if (isLoggedIn) { 
        spotifyLoginButton.classList.remove('flashing');
        spinner.style.display = 'block';

        // Get user profile information to retrieve user id
        const userProfileResponse = await fetch('/user-profile');
        const userProfileData = await userProfileResponse.json();
        const userId = userProfileData.userId;
        const bookName = document.getElementById('bookName').value;

        //Obtain song title and author from chatGpt output
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

        // Search for songs and collect their URIs
        const songUris = [];
        const notFoundSongs = [];
        for (const song of songs) {
            const response = await fetch('http://localhost:3000/search-song', {
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

        // Create playlist on Spotify
        const createPlaylistResponse = await fetch('http://localhost:3000/create-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, bookName }),
        });

        const createPlaylistData = await createPlaylistResponse.json();
        const playlistUrl = createPlaylistData.playlistUrl;
        const playlistId = createPlaylistData.playlistId;

        // Add songs to the playlist
        await fetch('http://localhost:3000/add-songs-to-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlistId, songUris }),
        });

        spinner.style.display = 'none';

        window.open(playlistUrl, '_blank');
        openPlaylistButton.disabled = true;

    } else {
        spinner.style.display = 'none';
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please log in with Spotify to create a playlist.';
        spotifyLoginButton.classList.add('flashing');
    }
};