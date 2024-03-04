let booksData = [];
let cartItems = [];

document.addEventListener('DOMContentLoaded', function () {
  fetch('books.json')
    .then(response => response.json())
    .then(data => {
      booksData = data;
      renderBooks(booksData);
    })
    .catch(error => console.error('Error fetching book data:', error));

  const categoryFilter = document.getElementById('category-filter');
  const authorFilter = document.getElementById('author-filter');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const sortBySelect = document.getElementById('sort-by');

  categoryFilter.addEventListener('change', applyFilters);
  authorFilter.addEventListener('input', applyFilters);
  minPriceInput.addEventListener('input', applyFilters);
  maxPriceInput.addEventListener('input', applyFilters);
  sortBySelect.addEventListener('change', applyFilters);

  const bookList = document.getElementById('book-list');
  bookList.addEventListener('click', function (event) {
    if (event.target.dataset.bookTitle) {
      const bookTitle = event.target.dataset.bookTitle;
      const book = booksData.find(book => book.title === bookTitle);
      if (book) {
        addToCart(book);
      }
    }
  });
});

function addToCart(book) {
  const existingCartItem = cartItems.find(item => item.title === book.title);
  if (existingCartItem) {
    existingCartItem.quantity++;
  } else {
    cartItems.push({ title: book.title, quantity: 1, price: book.price });
  }
  renderCart();
}

function removeFromCart(bookTitle) {
  cartItems = cartItems.filter(item => item.title !== bookTitle);
  renderCart();
}

function renderCart() {
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.innerHTML = '';

  let cartTotal = 0;
  cartItems.forEach(item => {
    const rowTotal = item.quantity * item.price;
    cartTotal += rowTotal;
    cartItemsElement.innerHTML += `
      <tr>
        <td>${item.title}</td>
        <td>${item.quantity}</td>
        <td>$${item.price}</td>
        <td>$${rowTotal}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.title}')">Remove</button></td>
      </tr>
    `;
  });

  document.getElementById('cart-total').textContent = `$${cartTotal.toFixed(2)}`;
}

function applyFilters() {
  const category = document.getElementById('category-filter').value;
  const author = document.getElementById('author-filter').value;
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const sortBy = document.getElementById('sort-by').value;

  let filteredBooks = booksData.filter(book =>
    (category === 'All' || book.category === category) &&
    (author === '' || book.author.toLowerCase().includes(author.toLowerCase())) &&
    (minPrice === '' || book.price >= minPrice) &&
    (maxPrice === '' || book.price <= maxPrice)
  );

  sortBooks(filteredBooks, sortBy);
  renderBooks(filteredBooks);
}

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
            <button class="btn btn-primary" data-book-title="${book.title}">Add to Cart</button>
            <button class="btn btn-secondary" onclick="showDetails('${book.title}')">Details</button>
          </div>
        </div>
      </div>
    `;
  });
}

function sortBooks(books, chosenFilter) {
  switch (chosenFilter) {
    case "title-asc":
      books.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "title-desc":
      books.sort((a, b) => b.title.localeCompare(a.title));
      break;

    case "author-asc":
      books.sort((a, b) => a.author.localeCompare(b.author));
      break;

    case "author-desc":
      books.sort((a, b) => b.author.localeCompare(a.author));
      break;

    case "price-asc":
      books.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      books.sort((a, b) => b.price - a.price);
      break;

    default:
      break;
  }
}
function openCartModal() {
  const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));

  const cartItemsElement = document.getElementById('cart-items');
  const cartTotal = calculateCartTotal();

  cartItemsElement.innerHTML = '';
  cartItems.forEach(item => {
    cartItemsElement.innerHTML += `
      <div>
        <p>${item.title} - Quantity: ${item.quantity}</p>
        <p>Total Price: $${(item.quantity * item.price).toFixed(2)}</p>
      </div>
    `;
  });
  cartItemsElement.innerHTML += `<p><strong>Total: $${cartTotal.toFixed(2)}</strong></p>`;

  cartModal.show();
}

function calculateCartTotal() {
  let cartTotal = 0;
  cartItems.forEach(item => {
    cartTotal += item.quantity * item.price;
  });
  return cartTotal;
}



function closeCartModal() {
  const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
  cartModal.hide();
}


function showDetails(bookTitle) {
  toggleDetails(bookTitle);
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
