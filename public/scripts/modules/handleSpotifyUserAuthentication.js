export let isLoggedIn = false;

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the Spotify client ID
    fetch('/spotify-client-id')
        .then(response => response.text())
        .then(clientId => {
            const spotifyLoginButton = document.getElementById('spotifyLoginButton');
            // Set the login button href with the Spotify authorization URL
            spotifyLoginButton.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=https://bookbeats-187997a9d1fc.herokuapp.com/callback&scope=playlist-modify-private`;
        });
    // Update the login button based on the user's login status
    updateLoginButton();
});

// Function to update the login button based on user's login status
const updateLoginButton = () => {
    // Fetch the user profile
    fetch('/user-profile')
        .then(response => response.json())
        .then(data => {
            if (data.profile && data.profile.display_name) {
                const spotifyLoginButton = document.getElementById('spotifyLoginButton');
                // Set the login button text to display the user's name
                spotifyLoginButton.textContent = `Logged in as ${data.profile.display_name}`;
                spotifyLoginButton.classList.add('logged-in');

                const logoutLink = document.getElementById('logoutLink');
                // Show the logout link
                logoutLink.style.display = "inline";
                // Dispatch a custom event to indicate the login status change
                document.dispatchEvent(new CustomEvent('loginStatusChanged', {detail: { isLoggedIn: true }}));
            }
        })
        .catch(error => console.error('Error fetching user profile:', error));
};

// Function to handle the logout action
export function logoutUser () {
    const url = 'https://www.spotify.com/logout/';
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40');
    setTimeout(() => {
        spotifyLogoutWindow.close();
        resetButtons();
    }, 2000);
};

// Function to reset the login buttons
const resetButtons = () => {
    const spotifyLoginButton = document.getElementById('spotifyLoginButton');
    spotifyLoginButton.textContent = 'Log in with Spotify';
    spotifyLoginButton.classList.remove('logged-in');

    const logoutLink = document.getElementById('logoutLink');
    // Hide the logout link
    logoutLink.style.display = "none";
    // Dispatch a custom event to indicate the login status change
    document.dispatchEvent(new CustomEvent('loginStatusChanged', {detail: { isLoggedIn: false }}));
};