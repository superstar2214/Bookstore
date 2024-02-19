fetch('books.json')
  .then(response => response.json())
  .then(data => {
    const bookList = document.getElementById('book-list');
    data.forEach(book => {
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
  })
  .catch(error => console.error('Error fetching book data:', error));
