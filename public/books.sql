CREATE DATABASE books_app;
\c books_app;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255),
  author VARCHAR(255),
  isbn VARCHAR(20),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(25)
);

INSERT INTO books
(title, author, description, bookshelf)
VALUES (
  'Sequels',
  'Them',
  'A great story about databases',
  'Coding'
);

INSERT INTO books
(image_url)
VALUES (
  'https://i.imgur.com/J5LVHEL.jpg'
);