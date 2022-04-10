# ExpressJS - Tickitix RESTful API

Movie ticket booking API

## Description

This project is a RESTful API of movie ticket booking app. This API let you perform movie ticket booking realted action such as CRUD operation for movie list and schedule list, booking seats, and even for displaying dashboard of monthly revenue. For a complete list of action this API can serve, please refer to this [postman documentation](https://documenter.getpostman.com/view/20140040/UVyuRuiV)

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Getting Started

### Requirements

1. [Node.JS](https://nodejs.org/en/download/)
2. Node_modules  
   Download all dependencies needed for this project by simply run this command

   ```
   npm install
   ```

3. API Development tools  
   This project uses [Postman](https://www.getpostman.com/)
4. Web Server and MySQL  
   This project uses [XAMPP](https://www.apachefriends.org/download.html)
5. [Redis](https://redis.io/download/)
6. Cloud-based image and video management service  
   This project uses [Cloudinary](https://cloudinary.com/)
7. Payment gateway service  
   This project uses [Midtrans](https://midtrans.com/)

### Executing Program

1. Make sure you have already installed all of the [**requirements**](#requirements)
2. Create a new file called **.env**, and then set it up [like this](#set-up-env-file)
3. Turn on Web Server and MySQL
4. Import sql file to **phpmyadmin**
5. Open Postman desktop application or web app
6. Choose HTTP Method and enter request url (e.g. localhost:3001/)
7. You can see all the end points [here](https://documenter.getpostman.com/view/20140040/UVyuRuiV)

### Set up .env file

Create an `.env` file on root folder and copy this code below into it. Change its value with your own credential. You can also use `.env.example` file and simply rename it to `.env`

```
PORT=

MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAIL_CLIENT_ID=
MAIL_CLIENT_SECRET=
MAIL_REFRESH_TOKEN=

MIDTRANS_PRODUCTION=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
```

## License

© [Thariq Farsha](https://github.com/thariqfarsha/)
