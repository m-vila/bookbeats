// Function to restore the book name using local storage
export const restoreBookName = () => {
    const bookName = localStorage.getItem('bookName');
    if (bookName) {
        document.getElementById('bookName').value = bookName;
        localStorage.removeItem('bookName');
    }
};