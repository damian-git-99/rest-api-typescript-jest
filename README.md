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
## Use Case Diagram

![This is an image](https://i.ibb.co/Xz7QLxz/use-Case-Diagram.png)

## Users API 
```
SignIn: POST /api/1.0/users { username, email, password }

```