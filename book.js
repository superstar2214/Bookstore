let booksData = [];
let cart = [];


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

document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.btn-primary');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      const bookTitle = event.target.dataset.bookTitle;
      const book = booksData.find(book => book.title === bookTitle);
      addToCart(book);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const categoryFilter = document.getElementById('category-filter');
  const authorFilter = document.getElementById('author-filter');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const sortBySelect = document.getElementById('sort-by');

  // Event listener for category filter
  categoryFilter.addEventListener('change', function () {
    filterByCategory(categoryFilter.value);
  });

  // Event listener for author filter
  authorFilter.addEventListener('input', function () {
    filterByAuthor(authorFilter.value);
  });

  // Event listeners for min and max price inputs
  minPriceInput.addEventListener('input', applyPriceFilter);
  maxPriceInput.addEventListener('input', applyPriceFilter);

  // Event listener for sorting
  sortBySelect.addEventListener('change', function () {
    sortBooks(sortBySelect.value);
  });
});

// Function to apply price filter
function applyPriceFilter() {
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  filterByPrice(minPrice, maxPrice);
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

function calculateTotalItems() {
  let totalItems = 0;
  for (let i = 0; i < cart.length; i++) {
    totalItems += cart[i].qty;
  }
  return totalItems;
}


function addToCart(book) {
  // Increment quantity if the same title is added
  if (cart.find(item => item.title === book.title)) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].title === book.title) {
        cart[i].qty++;
        break;
      }
    }
  } else { // Otherwise, add the book to the cart array
    cart.push({ title: book.title, qty: 1, price: book.price });
  }

  // Update cart display
  document.querySelector(".navbar-cart").innerHTML = `<i class="bi bi-cart">${calculateTotalItems()}</i>`;
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';

  cart.forEach(item => { // Change 'shoppingCart' to 'cart'
    cartList.innerHTML += `
      <div class="row mb-3">
        <div class="col">${item.title}</div>
        <div class="col">${item.qty}</div> <!-- Change 'item.quantity' to 'item.qty' -->
        <div class="col">$${item.price}</div>
        <div class="col">$${item.qty * item.price}</div> <!-- Change 'item.quantity' to 'item.qty' -->
      </div>
    `;
  });

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0); // Change 'shoppingCart' to 'cart'
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
