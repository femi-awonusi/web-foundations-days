# Library Books REST API

## Overview

The Library Books API allows clients to retrieve, create, update and
delete book records. It also supports searching for books by author.

Base URL: `https://api.example.com`

Each book has an ID, title, author and publication year.

## 1. List All Books

- **Method:** GET
- **Path:** `/books`
- **Description:** Retrieves a list of all books in the library.
- **Success status:** `200 OK`

## 2. Get One Book

- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Retrieves a single book using its ID.
- **Success status:** `200 OK`

Example request:

`GET /books/12`

## 3. Create a Book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book record.
- **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publicationYear": 1958
  }
  ```

- **Success status:** `201 Created`

## 4. Update a Book

- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publicationYear": 1958
  }
  ```

- **Success status:** `200 OK`

## 5. Delete a Book

- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Deletes a book using its ID.
- **Success status:** `204 No Content`

Example request:

`DELETE /books/12`

## 6. List Books by Author

- **Method:** GET
- **Path:** `/books?author={authorName}`
- **Description:** Retrieves books written by the specified author.
- **Success status:** `200 OK`

Example request:

`GET /books?author=Chinua%20Achebe`

## Error Responses

### 400 Bad Request

- **Description:** The request contains invalid data or parameters.
- **Example:** A client tries to create a book without the required title
  or author fields.

### 404 Not Found

- **Description:** The requested resource does not exist.
- **Example:** A client requests `GET /books/999` when book 999 does not
  exist.
