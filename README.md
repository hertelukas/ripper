# Ripper

Ripper is an online multiplayer social deduction game. The current status of development can be seen [here](https://ripperitin.herokuapp.com/).

## Installation

 - Make sure you have [mongodb](https://docs.mongodb.com/manual/installation/) and [node](https://nodejs.org/en/) installed. 
 - Clone the current version onto your server.
 - Run `npm install` to install all dependencies.
 - Run `node app.js` and start the server.
 
 ### Configuration
To configure variables add a .env file.
| Name     | Default                  | Description                                                                   |
|----------|--------------------------|-------------------------------------------------------------------------------|
| NODE_ENV | -                        | Lets you change between different environments. (Ex. `DEVELOPMENT`, `PRODUCTION)` |
| PORT     | 3000                     | Port the node application is running.                                         |
| SECRET   | Gzuz mir gehts gut jetzt | Express-Session password. Should be changed!                                  |
