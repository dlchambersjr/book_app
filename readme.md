# book_app

**Author**: David Chambers, Andy Fields
**Version**: 1.1.0

## Overview
Full stack application to track a book list with the ability to search the Google Books API, add the books to a SQL database, and then pull the books from the Postgres Database and render them in the app.

## Getting Started
To install this package on your local system:
1. Clone the repository into your local system
2. Launch ```npm -i``` in the directory of the repository.
3. 

## Architecture
This project uses the following technologies:
* JavaScript
* Node.js
* express: ```npm i express```
* superagent: ```npm i superagent```
* dotenv: ```npm i dotenv```
* cors: ```npm i cors```
* postgres: ```npm i pg ```
* Deployed live on Heroku at dc-af-rm-booklist.herokuapp.com

### Database SCHEMA

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255),
  author VARCHAR(255),
  isbn VARCHAR(20),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(25)
);

## Change Log

09-25-2018 @ 9:15am (DC) - Set-up repository and inital scaffolding
09-25-2018 @ 10:00am (DC) - Finished server side rendering with proof of life 
09-25-2018 @ 10:45am (AF) - Successful retrieval of Google Books API Data
09-25-2018 @ 11:30am (AF) - Search Results display correctly
09-25-2018 @ 11:45am (DC) - Error handling for internal server and 404 implemented
09-25-2018 @ 1:45pm (RM) - Pages styled with basic structure

09-26-2018 @ 9:30am (DC) - Setup for lab-12 complete
09-26-2018 @ 10:00am (DC/AF/RM) - Database created with proof of life.
09-26-2018 @ 11:00am (DC/AF/RM) - Inital display of stored books on index
09-26-2018 @ 12:45pm (DC) - Inital stucture and coding for details and add app.get processes
09-26-2018 @ 1:30pm (AF/RM) - Structured pages to include via EJS, worked on design of details.ejs.


## Credits and Collaborations
* Front end starter code provided by Samm Hamm and Allie Grampa
* Utilizes outside API from Google Books