export const restoreChatGptOutput = () => {
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