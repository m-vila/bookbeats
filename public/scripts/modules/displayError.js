// Function to display an error message on the UI
export function displayError(errorMessage) {
    const errorContainer = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const spinner = document.getElementById('spinnerGeneratePlaylist');

    // Update error text content and display error container
    if (errorContainer && errorText) {
        errorText.textContent = errorMessage;
        errorContainer.style.display = 'block';
    }
    
    // Hide spinner if exists
    if (spinner) {
        spinner.style.display = 'none';
    }
}