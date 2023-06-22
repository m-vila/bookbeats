// Function to initialize autocomplete functionality for the book name input field
export function initAutocomplete() {
    const bookNameInput = document.getElementById('bookName');
    const autoCompleteList = document.createElement('ul');
    autoCompleteList.setAttribute('id', 'autocomplete-list');
    bookNameInput.insertAdjacentElement('afterend', autoCompleteList);

    // Adds an event listener to the book name input to listen for input changes
    bookNameInput.addEventListener('input', async event => {
        const query = event.target.value;
        //When the input value length is greater than 2 characters, makes a fetch request 
        // to the server to retrieve autocomplete suggestions based on the query
        if (query.length > 2) {
            try {
                const response = await fetch(`/autocomplete?q=${query}`);
                const data = await response.json();
                displayAutoCompleteSuggestions(data.items, bookNameInput, autoCompleteList);
                document.getElementById("autocomplete-list").style.display = "block";
            } catch (error) {
                console.error('Error fetching data from server:', error);
            }
        } else {
            autoCompleteList.innerHTML = '';
            document.getElementById("autocomplete-list").style.display = "none";
        }
    });

    // Clears the autocomplete list and hides it when a click occurs outside the list or on the book name input
    document.addEventListener('click', event => {
        const target = event.target;
        if (!autoCompleteList.contains(target) && target !== bookNameInput) {
            autoCompleteList.innerHTML = '';
            document.getElementById("autocomplete-list").style.display = "none";
        }
    });
}

// Function to display autocomplete suggestions in the autocomplete list
function displayAutoCompleteSuggestions(items, bookNameInput, autoCompleteList) {
    autoCompleteList.innerHTML = '';
    items.forEach(item => {
        const title = item.title;
        const authors = item.authors ? item.authors.join(', ') : '';
        const thumbnail = item.thumbnail;

        const li = document.createElement('li');

        if (thumbnail) {
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = `${title} cover`;
            img.style.width = '40px';
            img.style.height = '60px';
            img.style.marginRight = '10px';
            li.appendChild(img);
        }

        const text = document.createTextNode(`${title} by ${authors}`);
        li.appendChild(text);

        // Attaches event listeners to each list item to handle selection
        li.addEventListener('click', () => {
            bookNameInput.value = `${title} by ${authors}`;
            autoCompleteList.innerHTML = '';
            document.getElementById("autocomplete-list").style.display = "none";
        });

        autoCompleteList.appendChild(li);
    });
}