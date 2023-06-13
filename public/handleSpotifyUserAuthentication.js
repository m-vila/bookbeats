document.addEventListener("DOMContentLoaded", function () {
    fetch('/spotify-client-id')
        .then(response => response.text())
        .then(clientId => {
            const spotifyLoginButton = document.getElementById('spotifyLoginButton');
            spotifyLoginButton.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:3000/callback&scope=playlist-modify-private&show_dialog=true`;
        });
    updateLoginButton();
});

const updateLoginButton = () => {
    fetch('/user-profile')
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                const spotifyLoginButton = document.getElementById('spotifyLoginButton');
                spotifyLoginButton.textContent = `Logged in as ${data.display_name}`;
                spotifyLoginButton.classList.add('logged-in');
            }
        })
        .catch(error => console.error('Error fetching user profile:', error));
};