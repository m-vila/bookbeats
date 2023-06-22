import { displayError } from './displayError.js';

export const fetchChatGptResponse = async () => {
    const bookName = document.getElementById('bookName').value;
    const numSongs = document.getElementById('numSongs').value;
    const spinner = document.getElementById('spinnerGeneratePlaylist');
    const chatGptOutput = document.getElementById('chatGptOutput');
    const generateButton = document.querySelector('#generatePlaylist');
    const openPlaylistButton = document.getElementById('openPlaylistWithSpotify');

    openPlaylistButton.disabled = false;
    
    // Validates the input values
    if (!bookName.trim() || isNaN(numSongs) || numSongs <= 0 || numSongs > 30 || !Number.isInteger(parseFloat(numSongs))) {
        displayError('Please enter a book title and a number of songs between 1 and 30.');
        return;
    }
    
    // Displays a spinner while fetching the response
    spinner.style.display = 'block';
    chatGptOutput.style.display = 'none';
    openPlaylistButton.style.display = 'none';
    chatGptOutput.textContent = '';
    generateButton.disabled = true;

    try {
        // Fetch chatGpt response from the API
        const response = await fetch('http://localhost:3000/fetch-chat-gpt-response', {
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
            displayError('An error occurred. Please check the API connection.');
            return;
        }

        // Display the generated songs in chatGptOutput
        const choicesContent = data.choices[0].message.content.trim();
        const songs = choicesContent.split('\n');
        chatGptOutput.innerHTML = '';
        chatGptOutput.style.display = 'block';
        songs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song;
            chatGptOutput.appendChild(li);
        });

        chatGptOutput.style.display = 'block';
        openPlaylistButton.style.display = 'block';

        // Store bookName and chatGptOutput in local storage
        localStorage.setItem('bookName', bookName);
        localStorage.setItem('chatGptOutput', chatGptOutput.innerHTML);

        openPlaylistButton.style.display = 'block';

    } catch (error) {
        displayError(error.message);
    } finally {
        spinner.style.display = 'none';
        generateButton.disabled = false;
    }
}