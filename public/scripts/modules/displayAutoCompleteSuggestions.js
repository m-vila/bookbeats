export function initAutocomplete() {
    const bookNameInput = document.getElementById('bookName');
    const autoCompleteList = document.createElement('ul');
    autoCompleteList.setAttribute('id', 'autocomplete-list');
    bookNameInput.insertAdjacentElement('afterend', autoCompleteList);

    bookNameInput.addEventListener('input', async event => {
        const query = event.target.value;
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
}

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

        li.addEventListener('click', () => {
            bookNameInput.value = `${title} by ${authors}`;
            autoCompleteList.innerHTML = '';
            document.getElementById("autocomplete-list").style.display = "none";
        });

        autoCompleteList.appendChild(li);
    });
}