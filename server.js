'strict';

// ===========================
// Build out the initial server
// ===========================

//Required Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();


//Create an instance of express in the variable app
const app = express();

// Establish the PORT number for the server
const PORT = process.env.PORT || 3000;

// Tell the server to get files from the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//Start database connection
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

client.on('error', err => console.error(err));

// Tell express to use EJS files
app.set('view engine', 'ejs');

// ++++++++++++++++
// Routes to listen
// ++++++++++++++++

// index.ejs
app.get('/', startApp);

// Book Details BUtton
app.get('/book/:id', bookDetails);

// Search Request
app.get('/new', newSearch);
app.post('/searches', searchResults);

// Add Books to the database
app.post('/add', addBook);




//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs'));

// Activate the server
app.listen(PORT, () => console.log(`(Book-App) listening on: ${PORT}`));


// +++++++++++++++++++++++++++++++++
// Helper functions
// +++++++++++++++++++++++++++++++++


// Constructor to build our book instances
function Book(info) {
  const placeholderImage = 'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';

  this.title = info.title || 'No title available';
  this.author = info.authors || 'No author available';
  this.isbn = (info.industryIdentifiers[0].identifier.length < 13 ) ? info.industryIdentifiers[1].identifier : info.industryIdentifiers[0].identifier || 'No ISBN available';
  this.image_url = info.imageLinks.thumbnail || placeholderImage;
  this.description = info.description;
}

// retrives the books from the database and renders to indexedDB.ejs
function startApp(request, response) {
  const SQL = 'SELECT * FROM books;';
  return client.query(SQL)
    .then(books => {
      console.log(typeof books);
      console.log(books);
      response.render('index', { bookList: books.rows });
    })
}

//Search for a book on Google Books
function newSearch(request, response) {
  response.render('pages/searches/new');
}

function searchResults(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log(request.body);

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }
  console.log(url);
  superagent.get(url)
    .then(bookList => bookList.body.items.map(book => {
      console.log(book.volumeInfo.industryIdentifiers[1]);
      return new Book(book.volumeInfo);
    }))
    .then(bookList => {
      response.render('pages/searches/show', { books: bookList });
    })
    .catch(err => processErrors(err, response));
}

// Retrieve the details of a book
function bookDetails(request, response) {
  console.log('DETAILS BUTTON CLICKED!');

  const SQL = 'SELECT * FROM books WHERE id=$1;';
  const values = [request.params.id];

  client.query(SQL, values)
    .then(result => response.render('pages/books/show', { bookList: result.rows[0] }))
    .catch(err => processErrors(err, response));
}

//Add a book to the database
function addBook(request, response) {
  console.log('ADD BUTTON CLICKED!');

  let { title, author, isbn, image_url, description, bookshelf } = request.body;

  const SQL = 'INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  const values = [title, author, isbn, image_url, description, bookshelf];

  console.log('+++++++++++++++++++\n\n');
  console.log(SQL);
  console.log('\n\n+++++++++++++++++++');


  return client.query(SQL, values)
    .then(response.redirect('/'))
    .then(bookDetails)
    .catch(err => processErrors(err, response));
}

// Error Handler
function processErrors(error, response) {
  response.render('pages/error', { errorResult: error })
}


