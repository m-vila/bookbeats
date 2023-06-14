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

                const logoutLink = document.getElementById('logoutLink');
                logoutLink.style.display = "inline";

                document.dispatchEvent(new CustomEvent('loginStatusChanged', {detail: { isLoggedIn: true }}));
            }
        })
        .catch(error => console.error('Error fetching user profile:', error));
};

const logoutUser = () => {
    const url = 'https://www.spotify.com/logout/';
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40');
    setTimeout(() => {
        spotifyLogoutWindow.close();
        resetButtons();
    }, 2000);
};

const resetButtons = () => {
    const spotifyLoginButton = document.getElementById('spotifyLoginButton');
    spotifyLoginButton.textContent = 'Log in with Spotify';
    spotifyLoginButton.classList.remove('logged-in');

    const logoutLink = document.getElementById('logoutLink');
    logoutLink.style.display = "none";

    document.dispatchEvent(new CustomEvent('loginStatusChanged', {detail: { isLoggedIn: false }}));
};