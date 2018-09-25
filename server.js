'strict';

// ===========================
// Build out the initial server
// ===========================

//Required Dependencies
const express = require('express');
const superagent = require('superagent');

//Create an instance of express in the variable app
const app = express();

// Establish the PORT number for the server
const PORT = process.env.PORT || 3000;

// Tell the server to get files from the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Tell express to use EJS files
app.set('view engine', 'ejs');

// Routes to listen for:
app.get('/', newSearch);

app.post('/searches', bookResults);


//Set the catch all route
app.get('*', (request, response) => response.status(404).send(`"This is not the route your looking for..." becasue it's not found`));

// Activate the server
app.listen(PORT, () => console.log(`(Lab-11) listening on: ${PORT}`));

function newSearch(request, response) {
  response.render('index');
}

// Helper Functions
function Book(info) {
  const placeholderImage = 'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';

  this.title = info.title || 'No title available';
  this.author = info.authors || 'No author available';
  this.image_url = info.imageLinks.thumbnail || placeholderImage;
}


function bookResults(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log(request.body);

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }
  console.log(url);
  superagent.get(url)
    .then(bookList => bookList.body.items.map(book => {
      return new Book(book.volumeInfo);
    }))
    .then(bookList => {
      console.log(typeof bookList);
      console.log(bookList);
      response.render('pages/searches/show', {books: bookList});
    })
}
