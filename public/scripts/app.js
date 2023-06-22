import { fetchChatGptResponse } from './modules/fetchChatGptResponse.js';
import { openWithSpotifyButton } from './modules/openWithSpotifyButton.js';
import { restoreChatGptOutput } from './modules/restoreChatGptOutput.js';
import { restoreBookName } from './modules/restoreUserInput.js';
import { initAutocomplete } from './modules/displayAutoCompleteSuggestions.js';
import { logoutUser } from './modules/handleSpotifyUserAuthentication.js';

// Event listener for clicking on "generatePlaylist" button 
document.getElementById('playlistForm').addEventListener('submit', event => {
    event.preventDefault();

    // Fetching the ChatGPT response
    fetchChatGptResponse();
});

// Event listener for when the window loads
window.addEventListener('load', () => {

    // Closing pop-ups
    document.querySelector('.close-btn').addEventListener('click', event => {
        event.target.parentNode.style.display = 'none';
    });

    // Google Books autocomplete
    initAutocomplete();

    // Restore chat GPT output
    restoreChatGptOutput();

    // Restore book name
    restoreBookName();
});

// Event listener for clicking on "Open playlist with Spotify" button
document.getElementById('openPlaylistWithSpotify').addEventListener('click', openWithSpotifyButton);

// Event listener for clicking on "Logout" link
document.getElementById('logoutLink').addEventListener('click', logoutUser);