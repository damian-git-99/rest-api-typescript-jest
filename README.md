
# REST API

Example of a rest api using node js with typescript and jest for testing


## Authors

- [@damian](https://github.com/damian-git-99)


## 
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)
[![](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![](	https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![](https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)](https://typestrong.org/ts-node/)

## Run with docker
- Install Docker
- run `docker compose up`
## Run Manually

Install postgresql

```bash
  CREATE DATABASE users_db;
  Change postgresql user and password from config/development.json file
```
    
Clone the project

```bash
  git clone https://github.com/damian-git-99/rest-api-typescript-jest.git
```

Go to the project directory

```bash
  cd rest-api-typescript-jest

```

Install dependencies

```bash
  npm install
```

Run in production

```bash
  npm run build
  npm start
  By default the application runs on port 3000 (to change it modify the port in the index.ts file)
```

Run in development

```bash
  npm run dev
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## ER Diagram

![ER Diagram](https://i.ibb.co/J7WqJxJ/erdiagram.png)

## Use Case Diagram

![Use Case Diagram](https://i.ibb.co/Pc0nPwB/final-Use-Case-Diagram.png)


## API Reference
#### Use postman to test the api (import the file API-REST-JEST.postman_collection.json)
#### ***All data received by the body must be in json format

### SignIn

```http
  POST /api/1.0/users
```
#### Body Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your username |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Response
    HTTP 200 OK
    {
      message: User Created
    }
---
### LogIn

```http
  POST /api/1.0/auth
```

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Response
    HTTP 200 OK
    {
      id: 1,
      username: foo,
      token
    }
---

### Logout

```http
  DELETE /api/1.0/logout
```

#### Headers Parameters
| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer token` | **Required**. your generated token |

#### Response
    HTTP 200 OK
    {
      message: 'token removed successfully'
    }
---

### Find All Users

```http
  GET /api/1.0/users
```

#### Headers Parameters
| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer token` | **Required**. your generated token |

#### Response
    HTTP 200 OK
    {
      users
    }
---

### Find User

```http
  GET /api/1.0/users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of user to fetch |

#### Headers Parameters
| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer token` | **Required**. your generated token |

#### Response
    HTTP 200 OK
    {
      user
    }
---

### Delete User

```http
  DELETE  /api/1.0/users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of user to detele |

#### Headers Parameters
| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer token` | **Required**. your generated token |

#### Response
    HTTP 200 OK
    {
      message: 'user deleted successfully'
    }
---

### Update User

```http
  PUT   /api/1.0/users/:id
```
#### Path parameters
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of user to update |

#### Headers Parameters
| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer token` | **Required**. your generated token |

#### Body Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your username |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Response
    HTTP 200 OK
    {
      user
    }
---

## Feedback

If you have any feedback please contact me damiangalvan66@gmail.com

