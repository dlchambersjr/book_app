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




//Set the catch all route
app.get('*', (request, response) => response.status(404).send(`"This is not the route your looking for..." becasue it's not found`));

// Activate the server
app.listen(PORT, () => console.log(`(Lab-11) listening on: ${PORT}`));

function newSearch(request, response) {
  response.render('index');
}
