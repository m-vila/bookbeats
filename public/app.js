const fetchData = async () => {
    const bookName = document.getElementById('bookName').value;
    const numSongs = document.getElementById('numSongs').value;
    const spinner = document.getElementById('spinner');
    const chatGptOutput = document.getElementById('chatGptOutput');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const generateButton = document.querySelector('#playlistForm button');
    
    let hideErrorMessageTimeout;

    if (!bookName.trim() || isNaN(numSongs) || numSongs <= 0 || numSongs > 30 || !Number.isInteger(parseFloat(numSongs))) {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please enter a book title and a number of songs between 1 and 30.';
        hideErrorMessageTimeout = setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 6000);
        
        return;
    }

    spinner.style.display = 'block';
    chatGptOutput.textContent = '';
    generateButton.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/fetchData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookName, numSongs }),
        });

        if (!response.ok) {
            throw new Error('An error occurred. Please check the network response');
        }

        const data = await response.json();

        if (data.error) {
            errorMessage.style.display = 'block';
            errorText.textContent = 'An error occurred. Please check the API connection.';
            spinner.style.display = 'none';
            hideErrorMessageTimeout = setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 6000);
            
            return;
        }

        const choicesContent = data.choices[0].message.content.trim();
        const songs = choicesContent.split('\n');
        chatGptOutput.innerHTML = '';
        chatGptOutput.style.display = 'block';
        songs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song;
            chatGptOutput.appendChild(li);
        });
        
        localStorage.setItem('bookName', bookName);
        localStorage.setItem('chatGptOutput', chatGptOutput.innerHTML);

        const openPlaylistWithSpotifyButton = document.getElementById('openPlaylistWithSpotify');
        openPlaylistWithSpotifyButton.style.display = 'block';

    } catch (error) {
        errorMessage.style.display = 'block';
        errorText.textContent = error.message;
    } finally {
        spinner.style.display = 'none';
        generateButton.disabled = false;
    }
}

const restoreChatGptOutput = () => {
    const chatGptOutput = localStorage.getItem('chatGptOutput');
    if (chatGptOutput) {
        const chatGptOutputElement = document.getElementById('chatGptOutput');
        chatGptOutputElement.innerHTML = chatGptOutput;
        chatGptOutputElement.style.display = 'block';
        localStorage.removeItem('chatGptOutput');

        const openPlaylistWithSpotifyButton = document.getElementById('openPlaylistWithSpotify');
        if (chatGptOutput.trim().length > 0) {
            openPlaylistWithSpotifyButton.style.display = 'block';
        }
    }
};

const restoreBookName = () => {
    const bookName = localStorage.getItem('bookName');
    if (bookName) {
        document.getElementById('bookName').value = bookName;
        localStorage.removeItem('bookName');
    }
};

document.getElementById('playlistForm').addEventListener('submit', event => {
    event.preventDefault();
    fetchData();
});

window.addEventListener('load', () => {
    document.querySelector('.close-btn').addEventListener('click', event => {
        clearTimeout(hideErrorMessageTimeout);
        event.target.parentNode.style.display = 'none';
    });
    restoreChatGptOutput();
    restoreBookName();
});

let isLoggedIn = false;

document.addEventListener('loginStatusChanged', (event) => {
    isLoggedIn = event.detail.isLoggedIn;
});

const openWithSpotifyButton = async () => {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const spotifyLoginButton = document.getElementById('spotifyLoginButton');
    
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
        hideErrorMessageTimeout = setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
};

document.getElementById('openPlaylistWithSpotify').addEventListener('click', openWithSpotifyButton);