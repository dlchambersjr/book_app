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

// Routes to listen for:
app.get('/', startApp);
app.get('/new', newSearch);

app.post('/searches', bookResults);


//Set the catch all route
// app.get('*', (request, response) => response.status(404).send(`"This is not the route your looking for..." becasue it's not found`));

//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs'));

// Activate the server
app.listen(PORT, () => console.log(`(Lab-11) listening on: ${PORT}`));

function startApp(request, response) {

  const SQL = 'SELECT * FROM books;';
  return client.query(SQL)
    .then(books => {
      console.log(typeof books);
      console.log(books);
      response.render('index', { bookList: books.rows });
    })

}



function newSearch(request, response) {
  response.render('pages/searches/new');
}

// Helper Functions
function Book(info) {
  const placeholderImage = 'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';

  this.title = info.title || 'No title available';
  this.author = info.authors || 'No author available';
  this.isbn = info.industryIdentifiers ? info.industryIdentifiers[1].indentifier : 'No ISBN available';
  this.image_url = info.imageLinks.thumbnail || placeholderImage;
  this.description = info.description;
}


function bookResults(request, response) {
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
    .catch(error => response.render('pages/error', { errorResult: error }));
}
