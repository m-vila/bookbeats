import { fetchChatGptResponse } from './modules/fetchChatGptResponse.js';
import { openWithSpotifyButton } from './modules/openWithSpotifyButton.js';
import { restoreChatGptOutput } from './modules/restoreChatGptOutput.js';
import { restoreBookName } from './modules/restoreUserInput.js';

document.getElementById('playlistForm').addEventListener('submit', event => {
    event.preventDefault();
    fetchChatGptResponse();
});

window.addEventListener('load', () => {
    document.querySelector('.close-btn').addEventListener('click', event => {
        event.target.parentNode.style.display = 'none';
    });
    restoreChatGptOutput();
    restoreBookName();
});

document.addEventListener('loginStatusChanged', (event) => {
    isLoggedIn = event.detail.isLoggedIn;
});

document.getElementById('openPlaylistWithSpotify').addEventListener('click', openWithSpotifyButton);

const bookNameInput = document.getElementById('bookName');
const autoCompleteList = document.createElement('ul');
autoCompleteList.setAttribute('id', 'autocomplete-list');
bookNameInput.insertAdjacentElement('afterend', autoCompleteList);

function displayAutoCompleteSuggestions(items) {
    autoCompleteList.innerHTML = '';
    items.forEach(item => {
        const title = item.title;
        const authors = item.authors ? item.authors.join(', ') : '';
        const thumbnail = item.thumbnail;

        const li = document.createElement('li');

        if (thumbnail) {
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = `${title} cover`;
            img.style.width = '40px';
            img.style.height = '60px';
            img.style.marginRight = '10px';
            li.appendChild(img);
        }

        const text = document.createTextNode(`${title} by ${authors}`);
        li.appendChild(text);

        li.addEventListener('click', () => {
            bookNameInput.value = `${title} by ${authors}`;
            autoCompleteList.innerHTML = '';
        });

        autoCompleteList.appendChild(li);
    });
}

bookNameInput.addEventListener('input', async event => {
    const query = event.target.value;
    if (query.length > 2) {
        try {
            const response = await fetch(`/autocomplete?q=${query}`);
            const data = await response.json();
            displayAutoCompleteSuggestions(data.items);
            document.getElementById("autocomplete-list").style.display = "block";
        } catch (error) {
            console.error('Error fetching data from server:', error);
        }
    } else {
        autoCompleteList.innerHTML = '';
        document.getElementById("autocomplete-list").style.display = "none";
    }
});