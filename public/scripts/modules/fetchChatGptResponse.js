export const fetchChatGptResponse = async () => {
    const bookName = document.getElementById('bookName').value;
    const numSongs = document.getElementById('numSongs').value;
    const spinner = document.getElementById('spinnerGeneratePlaylist');
    const chatGptOutput = document.getElementById('chatGptOutput');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const generateButton = document.querySelector('#generatePlaylist');
    const openPlaylistButton = document.getElementById('openPlaylistWithSpotify');

    openPlaylistButton.disabled = false;
    
    if (!bookName.trim() || isNaN(numSongs) || numSongs <= 0 || numSongs > 30 || !Number.isInteger(parseFloat(numSongs))) {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please enter a book title and a number of songs between 1 and 30.';
        return;
    }

    spinner.style.display = 'block';
    chatGptOutput.textContent = '';
    generateButton.disabled = true;

    try {
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
            errorMessage.style.display = 'block';
            errorText.textContent = 'An error occurred. Please check the API connection.';
            spinner.style.display = 'none';
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