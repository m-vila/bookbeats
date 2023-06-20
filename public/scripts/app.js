import { fetchChatGptResponse } from './modules/fetchChatGptResponse.js';
import { openWithSpotifyButton } from './modules/openWithSpotifyButton.js';
import { restoreChatGptOutput } from './modules/restoreChatGptOutput.js';
import { restoreBookName } from './modules/restoreUserInput.js';
import { initAutocomplete } from './modules/displayAutoCompleteSuggestions.js';

document.getElementById('playlistForm').addEventListener('submit', event => {
    event.preventDefault();
    fetchChatGptResponse();
});

window.addEventListener('load', () => {
    document.querySelector('.close-btn').addEventListener('click', event => {
        event.target.parentNode.style.display = 'none';
    });
    initAutocomplete();
    restoreChatGptOutput();
    restoreBookName();
});

document.addEventListener('loginStatusChanged', (event) => {
    isLoggedIn = event.detail.isLoggedIn;
});

document.getElementById('openPlaylistWithSpotify').addEventListener('click', openWithSpotifyButton);