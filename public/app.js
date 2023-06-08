async function fetchData() {
    const bookName = document.getElementById('bookName').value;
    let numSongs = document.getElementById('numSongs').value;
    const spinner = document.getElementById('spinner');
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (!bookName || !numSongs) {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Please enter a book name, author, and the number of songs.';
        return;
    }

    numSongs = Number(numSongs);
    if (isNaN(numSongs) || !Number.isInteger(numSongs) || numSongs < 1 || numSongs > 30) {
        errorMessage.style.display = 'block';
        errorText.textContent = 'Invalid number of songs. Please make sure it is a number between 1 and 30.';
        return;
    }

    spinner.style.display = 'block';
    output.textContent = '';

    try {
        const response = await fetch('http://localhost:3000/fetchData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookName, numSongs }),
        });

        if (!response.ok) {
            throw new Error(`Server returned status code ${response.status}`);
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
        output.innerHTML = '';
        output.style.display = 'block';
        songs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song;
            output.appendChild(li);
        });
    } catch (error) {
        errorMessage.style.display = 'block';
        errorText.textContent = `An error occurred: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
}

window.onload = () => {
    document.querySelector('.close-btn').addEventListener('click', (event) => {
        event.target.parentNode.style.display = 'none';
    });
}