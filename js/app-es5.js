// Book Constructor
function Book(title, author, isbn) {
   this.title = title;
   this.author = author;
   this.isbn = isbn;
}
// UI Constructor
function UI() { }
// Storage Constructor
function LStorage() { }

// Add Book To List Prototype
UI.prototype.addBookToList = function (book) {
   const bookList = document.getElementById('book-list');
   const row = document.createElement('tr');
   row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>
         <a class="delete-btn text-danger" href="#">
            <i class="fas fa-trash-alt"></i>
         </a>
      </td>
   `;
   bookList.appendChild(row);
}
// Clear All Fields
UI.prototype.clearFields = function () {
   document.getElementById('title').value = '';
   document.getElementById('author').value = '';
   document.getElementById('isbn').value = '';
}
// Show Message Prototype
UI.prototype.showMessage = function (message, className) {
   if (document.querySelector('.alert') === null) {
      const topBox = document.getElementById('top-box'),
         bookForm = document.getElementById('book-form');
      const div = document.createElement('div');
      div.appendChild(document.createTextNode(message));
      div.className = `alert ${className}`;
      topBox.insertBefore(div, bookForm);

      // Remove Message After 3 Seconds
      setTimeout(function () {
         document.querySelector('.alert').remove();
      }, 3000);
   }
}
// Delete From Book From The Book List
UI.prototype.removeBookFromList = function (target) {
   target.parentElement.parentElement.parentElement.remove();
}
// Hide Book Table
UI.prototype.hideTable = function () {
   document.getElementById('book-table').classList.add('d-none');
   document.getElementById('book-table').classList.remove('d-block');
}
// Show Book Table
UI.prototype.showTable = function () {
   document.getElementById('book-table').classList.add('d-block');
   document.getElementById('book-table').classList.remove('d-none');
}
// Check If LS is Empty
UI.prototype.isLSEmpty = function () {
   if (new LStorage().getBooksFromLS().length === 0) {
      return true;
   } else {
      return false;
   }
}
// Get Books From The LS
LStorage.prototype.getBooksFromLS = function () {
   let books;
   if (localStorage.getItem('books') === null) {
      books = [];
   } else {
      books = JSON.parse(localStorage.getItem('books'));
   }

   return books;
}
// Add Book To The LS
LStorage.prototype.addBookToLS = function (book) {
   const books = new LStorage().getBooksFromLS();

   books.push(book);

   // Send to the LS
   localStorage.setItem('books', JSON.stringify(books));
}
// Display Books From The LS
LStorage.prototype.displayBooksFromLS = function () {
   const books = new LStorage().getBooksFromLS();

   books.forEach(function (book) {
      new UI().addBookToList(book);
   });
}
// Remove Book From The LS
LStorage.prototype.removeBookFromLS = function (target) {
   const books = new LStorage().getBooksFromLS();
   const isbn = target.parentElement.parentElement.previousElementSibling.textContent;

   books.forEach(function (book, index) {
      if (book.isbn === isbn) {
         books.splice(index, 1);
      }
   });

   localStorage.setItem('books', JSON.stringify(books));
}

// Add Book Event Listener
document.getElementById('book-form').addEventListener('submit', function (e) {
   // Get Form Values
   const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value;

   // Validate Inputs
   if (title === '' || author === '' || isbn === '') {
      // Show Error Message
      new UI().showMessage('Please fill in all the fields.', 'alert-danger');
   } else {
      // Add Book To The List
      new UI().addBookToList(new Book(title, author, isbn));

      // Add Book To The LS
      new LStorage().addBookToLS(new Book(title, author, isbn));

      // Check if LS is Empty then if Empty then Hide Table
      if (new UI().isLSEmpty() === true) {
         new UI().hideTable();
      } else {
         new UI().showTable();
      }

      // Show Success Message Alert
      new UI().showMessage('Book Added!', 'alert-success');

      // Clear All Fields
      new UI().clearFields();
   }

   e.preventDefault();
});
// Delete Book From The Book List
document.getElementById('book-list').addEventListener('click', function (e) {
   // Remove Book From The Book List
   new UI().removeBookFromList(e.target);

   // Remove Book From The LS
   new LStorage().removeBookFromLS(e.target);

   // Check if LS is Empty then if Empty then Hide Table
   if (new UI().isLSEmpty() === true) {
      new UI().hideTable();
   } else {
      new UI().showTable();
   }

   // Show Success Message Alert
   new UI().showMessage('Book Removed!', 'alert-success');

   e.preventDefault();
});
// Display Books From The LS On Load
document.addEventListener('DOMContentLoaded', new LStorage().displayBooksFromLS());
// Hide/Show Table On Load
document.addEventListener('DOMContentLoaded', function () {
   // Check if LS is Empty then if Empty then Hide Table
   if (new UI().isLSEmpty() === true) {
      new UI().hideTable();
   } else {
      new UI().showTable();
   }
});

// Get Current Year
document.getElementById('year').textContent = new Date().getFullYear();