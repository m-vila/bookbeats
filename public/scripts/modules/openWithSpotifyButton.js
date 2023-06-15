export const openWithSpotifyButton = async () => {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const spotifyLoginButton = document.getElementById('spotifyLoginButton');

    // Check if the user is logged in
    const response = await fetch('/is-logged-in');
    const data = await response.json();
    const isLoggedIn = data.isLoggedIn;
    
    if (isLoggedIn) { 
        spotifyLoginButton.classList.remove('flashing');

        // Get user profile information to retrieve user id
        const userProfileResponse = await fetch('/user-profile');
        const userProfileData = await userProfileResponse.json();
        const userId = userProfileData.userId;
        const bookName = document.getElementById('bookName').value;

        //Obtain song title and author from chatGpt output
        const songElements = document.querySelectorAll('#chatGptOutput li');
        const songRegex = /"\s*([^"]+)"\s+by\s+([\w\s’.,&-]+)(?=\s|$)/g;
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

        console.log(songs);

        // Search for songs and collect their URIs
        const songUris = [];
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
            }
        }

        console.log(songUris);

        // Create playlist on Spotify
        const response = await fetch('http://localhost:3000/create-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, bookName }),
        });

        const data = await response.json();
        const playlistUrl = data.playlistUrl;
        const playlistId = data.playlistId;

        // Add songs to the playlist
        await fetch('http://localhost:3000/add-songs-to-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlistId, songUris }),
        });

        // Open playlist in a new tab
        window.open(playlistUrl, '_blank');

    } else {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please log in with Spotify to create a playlist.';
        spotifyLoginButton.classList.add('flashing');
    }
};