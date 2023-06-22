// Function to restore chat GPT output using local storage
export const restoreChatGptOutput = () => {
    const chatGptOutput = localStorage.getItem('chatGptOutput');
    // Retrieve chat GPT output from local storage
    if (chatGptOutput) {
        const chatGptOutputElement = document.getElementById('chatGptOutput');
        chatGptOutputElement.innerHTML = chatGptOutput;
        chatGptOutputElement.style.display = 'block';
        localStorage.removeItem('chatGptOutput');

        //Display the "Open playlist with Spotify" button if the chat GPT output is not empty
        const openPlaylistWithSpotifyButton = document.getElementById('openPlaylistWithSpotify');
        if (chatGptOutput.trim().length > 0) {
            openPlaylistWithSpotifyButton.style.display = 'block';
        }
    }
};