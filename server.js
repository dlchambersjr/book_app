'strict';

// ===========================
// Build out the initial server
// ===========================

//Required Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

require('dotenv').config();


//Create an instance of express in the variable app
const app = express();

// Establish the PORT number for the server
const PORT = process.env.PORT || 3000;

// Tell the server to get files from the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('X-HTTP-Method-Override'));

//Start database connection
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

client.on('error', err => console.error(err));

// Tell express to use EJS files
app.set('view engine', 'ejs');

// Method Override
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

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

// Update Books in database
app.put('/update/:id', updateBook);


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
  console.log('DETAIL SECTION STARTED!');

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

  const SQL = 'INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
  const values = [title, author, isbn, image_url, description, bookshelf];

  return client.query(SQL, values)
    .then(result => response.redirect(`/book/${result.rows[0].id}`))
    .catch(err => processErrors(err, response));
}

//Update a books details to the database
function updateBook(request, response) {
  console.log('UPDATE BUTTON CLICKED');

  let {title, author, isbn, image_url, description, bookshelf } = request.body;
  const SQL = 'UPDATE books SET title=$1, author=$2, image_url=$3, isbn=$4, description=$5, bookshelf=$6 WHERE id=$7 RETURNING id;';
  const values = [title, author, isbn, image_url, description, bookshelf, request.params.id];
  console.log('++++++++++++++++++++++++++');
  console.log(values);
  console.log('++++++++++++++++++++++++++');


  client.query(SQL, values)
    .then(result => response.redirect(`/book/${result.rows[0].id}`))
  // // .then(console.log(values))
    .catch(err => processErrors(err, response));
}



// Error Handler
function processErrors(error, response) {
  response.render('pages/error', { errorResult: error })
}


