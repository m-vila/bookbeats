import { fetchChatGptResponse } from './modules/fetchChatGptResponse.js';
import { openWithSpotifyButton } from './modules/openWithSpotifyButton.js';
import { restoreChatGptOutput } from './modules/restoreChatGptOutput.js';
import { restoreBookName } from './modules/restoreUserInput.js';
import { initAutocomplete } from './modules/displayAutoCompleteSuggestions.js';
import { logoutUser } from './modules/handleSpotifyUserAuthentication.js';

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


document.getElementById('openPlaylistWithSpotify').addEventListener('click', openWithSpotifyButton);
document.getElementById('logoutLink').addEventListener('click', logoutUser);