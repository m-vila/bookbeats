export function displayError(errorMessage) {
    const errorContainer = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const spinner = document.getElementById('spinnerGeneratePlaylist');

    if (errorContainer && errorText) {
        errorText.textContent = errorMessage;
        errorContainer.style.display = 'block';
    }

    if (spinner) {
        spinner.style.display = 'none';
    }
}