# Ripper

Ripper is an online multiplayer social deduction game. The current status of development can be seen [here](https://ripperitin.herokuapp.com/).

## Installation

 - Make sure you have [mongodb](https://docs.mongodb.com/manual/installation/) and [node](https://nodejs.org/en/) installed. 
 - Clone the current version onto your server.
 - Run `npm install` to install all dependencies.
 - Run `node app.js` and start the server.
 
 ### Configuration
To configure variables add a `.env` file.
| Name       | Default                    | Description                                                                                            |
|------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| NODE_ENV   | -                          | Lets you change between different environments. (Ex. `DEVELOPMENT`, `PRODUCTION`)                      |
| PORT       | `3000`                     | Port the node application is running.                                                                  |
| SECRET     | `Gzuz mir gehts gut jetzt` | Express-Session password. Should be changed!                                                           |
| MAX_GAMES  | `10`                       | The max number of games being played simultanously.                                                    |
| MAX_PLAYER | `6`                        | Max players in one game. Be careful when changing this.  (This can result in a worse game experience.) |
| ID_LENGTH  | `3`                        | The length of the id. If you host a lot of games, you may want to increase this number.                |
| DATABASE_URL| `mongodb://localhost:27017/ripper` | The url to your mongodb database. Not required. |
