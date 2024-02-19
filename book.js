fetch('books.json')
  .then(response => response.json())
  .then(data => {
    booksData = data;
    renderBooks(booksData);
  })
  .catch(error => console.error('Error fetching book data:', error));

let booksData = [];

function renderBooks(books) {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';

  books.forEach(book => {
    bookList.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.description}</p>
                        <p class="card-text">Author: ${book.author}</p>
                        <p class="card-text">Category: ${book.category}</p>
                        <p class="card-text">Price: $${book.price}</p>
                    </div>
                </div>
            </div>
        `;
  });
}

function filterByCategory(category) {
  if (category === 'All') {
    renderBooks(booksData);
  } else {
    const filteredBooks = booksData.filter(book => book.category === category);
    renderBooks(filteredBooks);
  }
}

const authorInput = document.getElementById('author-filter');

authorInput.addEventListener('input', function (event) {
  const author = event.target.value.trim();
  filterByAuthor(author);
});


function filterByPrice(minPrice, maxPrice) {
  const filteredBooks = booksData.filter(book => book.price >= minPrice && book.price <= maxPrice);
  renderBooks(filteredBooks);
}

function sortByTitle(order) {
  const sortedBooks = [...booksData].sort((a, b) => order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  renderBooks(sortedBooks);
}

function sortByPrice(order) {
  const sortedBooks = [...booksData].sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
  renderBooks(sortedBooks);
}

function sortByAuthor(order) {
  const sortedBooks = [...booksData].sort((a, b) => order === 'asc' ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author));
  renderBooks(sortedBooks);
}
