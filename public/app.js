const fetchData = async () => {
    const bookName = document.getElementById('bookName').value;
    const numSongs = document.getElementById('numSongs').value;
    const spinner = document.getElementById('spinner');
    const chatGptOutput = document.getElementById('chatGptOutput');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const generateButton = document.querySelector('#playlistForm button');

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

document.getElementById('playlistForm').addEventListener('submit', event => {
    event.preventDefault();
    fetchData();
});

window.addEventListener('load', () => {
    document.querySelector('.close-btn').addEventListener('click', event => {
        clearTimeout(hideErrorMessageTimeout);
        event.target.parentNode.style.display = 'none';
    });
});

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

        // Create playlist on Spotify
        //await createSpotifyPlaylist(songs);
    } else {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please log in with Spotify to create a playlist.';
        spotifyLoginButton.classList.add('flashing');
        hideErrorMessageTimeout = setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
};

restoreChatGptOutput();