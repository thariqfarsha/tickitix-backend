# ExpressJS - Tickitix RESTfull API

Movie ticket booking API

## Description

This project is a RESTful API of movie ticket bookig app.

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Getting Started

### Requirements

1. [Node.JS](https://nodejs.org/en/download/)
2. Node_modules

   ```
   npm install
   ```

3. [Postman](https://www.getpostman.com/)
4. Web Server and MySQL (e.g. [XAMPP](https://www.apachefriends.org/download.html))
5. [Redis](https://redis.io/download/)
6. [Cloudinary](https://cloudinary.com/)

### Executing Program

1. Make sure you have already installed all of the [**requirements**](#requirements)
2. Create a new file called **.env**, and then set it up [like this](#set-up-env-file)
3. Turn on Web Server and MySQL
4. Create a database with the name #nama_database, and Import file sql to **phpmyadmin**
5. Open Postman desktop application or web app
6. Choose HTTP Method and enter request url.(ex. localhost:3000/)
7. You can see all the end points [here](https://documenter.getpostman.com/view/20140040/UVyuRuiV)

### Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
PORT = 3001 // set port number
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "tickitix"
```

## License

© [Thariq Farsha](https://github.com/thariqfarsha/)
