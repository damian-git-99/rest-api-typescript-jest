### Example of a rest api using node js with typescript and jest for testing

#### Major packages used
```
* Express
* Sequalize
* Jest
* Postgres
* Typescrpt
```


## Usage
```
* CREATE DATABASE users_db;

* Change postgresql user and password from config/development.json file

* clone project: git clone https://github.com/damian-git-99/rest-api-typescript-jest.git

* Install Dependencies: npm install

* Run in production
  1 npm run build
  2 npm start

* Run in development
  * npm run dev

* Run Tests
 * npm test

```

## Authentication
```
For authentication, a token is stored in the database and related to a user, 
where a user can have one or many tokens.

When login is called successfully, the token is sent by the body of the response.

When the protected endpoints are called, 
the request must contain the token within the authorization key in the HTTP headers, this way we can check if the token is valid
```

## ER Diagram

![ER Diagram](https://i.ibb.co/J7WqJxJ/erdiagram.png)

## Use Case Diagram

![Use Case Diagram](https://i.ibb.co/Xz7QLxz/use-Case-Diagram.png)

## Users API 
```
SignIn: POST /api/1.0/users | { username, email, password }
LogIn: POST /api/1.0/auth   | { email, password }
Logout: DELETE /api/1.0/logout | token in headers
Find all users: GET /api/1.0/users
FindUser: GET /api/1.0/users/:id
```