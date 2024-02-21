let booksData = [];

fetch('books.json')
  .then(response => response.json())
  .then(data => {
    booksData = data;
    renderBooks(booksData);
  })
  .catch(error => console.error('Error fetching book data:', error));

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
            <p class="card-text d-none" id="description-${book.title}">${book.description}</p>
            <p class="card-text d-none" id="author-${book.title}">Author: ${book.author}</p>
            <p class="card-text">Category: ${book.category}</p>
            <p class="card-text">Price: $${book.price}</p>
            <button class="btn btn-primary" onclick="addToCart('${book.title}')">Add to Cart</button>
            <button class="btn btn-secondary" onclick="showDetails('${book.title}')">Details</button>
          </div>
        </div>
      </div>
    `;
  });
}



function sortBooks(chosenFilter) {
  switch (chosenFilter) {
    case "title-asc":
      sortByTitle('asc');
      break;

    case "title-desc":
      sortByTitle('desc');
      break;

    case "author-asc":
      sortByAuthor('asc');
      break;

    case "author-desc":
      sortByAuthor('desc');
      break;

    case "price-asc":
      sortByPrice('asc');
      break;

    case "price-desc":
      sortByPrice('desc');
      break;

    default:
      break;
  }
}

const sortSelect = document.getElementById('sort-by');
sortSelect.addEventListener('change', function (event) {
  const chosenFilter = event.target.value;
  sortBooks(chosenFilter);
});

function filterByCategory(category) {
  let filteredBooks;
  if (category === 'All') {
    filteredBooks = booksData;
  } else {
    filteredBooks = booksData.filter(book => book.category === category);
  }
  sortBooks(sortSelect.value);
  renderBooks(filteredBooks);
}

function filterByAuthor(author) {
  const filteredBooks = booksData.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
  sortBooks(sortSelect.value);
  renderBooks(filteredBooks);
}

function filterByPrice(minPrice, maxPrice) {
  const filteredBooks = booksData.filter(book => book.price >= minPrice && book.price <= maxPrice);
  sortBooks(sortSelect.value);
  renderBooks(filteredBooks);
}

function sortByTitle(order) {
  const sortedBooks = [...booksData].sort((a, b) => order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  renderBooks(sortedBooks);
}

function sortByAuthor(order) {
  const sortedBooks = [...booksData].sort((a, b) => order === 'asc' ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author));
  renderBooks(sortedBooks);
}

function sortByPrice(order) {
  const sortedBooks = [...booksData].sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
  renderBooks(sortedBooks);
}

function addToCart(bookTitle) {
  const book = booksData.find(book => book.title === bookTitle);
  if (book) {
    const existingItem = shoppingCart.find(item => item.title === book.title);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      shoppingCart.push({ ...book, quantity: 1 });
    }
    renderCart();
  }
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';

  shoppingCart.forEach(item => {
    cartList.innerHTML += `
      <div class="row mb-3">
        <div class="col">${item.title}</div>
        <div class="col">${item.quantity}</div>
        <div class="col">$${item.price}</div>
        <div class="col">$${item.quantity * item.price}</div>
      </div>
    `;
  });

  const totalPrice = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  cartList.innerHTML += `
    <div class="row">
      <div class="col"></div>
      <div class="col"></div>
      <div class="col"><strong>Total:</strong></div>
      <div class="col"><strong>$${totalPrice}</strong></div>
    </div>
  `;
}

function toggleDetails(bookTitle) {
  const description = document.getElementById(`description-${bookTitle}`);
  const author = document.getElementById(`author-${bookTitle}`);

  if (description.classList.contains('d-none')) {
    description.classList.remove('d-none');
    author.classList.remove('d-none');
  } else {
    description.classList.add('d-none');
    author.classList.add('d-none');
  }
}
function showDetails(bookTitle) {
  toggleDetails(bookTitle);
}



renderCart();
