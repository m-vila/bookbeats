async function fetchData() {
    const bookName = document.getElementById('bookName').value;
    const numSongs = document.getElementById('numSongs').value;
    const spinner = document.getElementById('spinner');
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (!bookName) {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please enter a book name and author.';
        return;
    }

    spinner.style.display = 'block';
    output.textContent = '';

    const response = await fetch('http://localhost:3000/fetchData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookName, numSongs }),
    });

    const data = await response.json();

    if (data.error) {
        errorMessage.style.display = 'block';
        errorText.textContent = 'An error occurred. Please check the API connection.';
        spinner.style.display = 'none';
        return;
    }

    const choicesText = data.choices[0].text.trim();
    const songs = choicesText.split('\n');
    output.innerHTML = '';
    output.style.display = 'block';
    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song;
        output.appendChild(li);
    });

    spinner.style.display = 'none';
}

window.onload = () => {
    document.querySelector('.close-btn').addEventListener('click', (event) => {
        event.target.parentNode.style.display = 'none';
    });
}
