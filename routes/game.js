const { json } = require('body-parser');

const express       = require('express'),
      router        = express.Router();


//TODO admin handling

module.exports = function(io){
const MAX_GAMES = 10;
const MAX_PLAYER = 6;
const ID_LENGTH = 5;

var games = {};

router.get('/:id', function(req, res){
    var id = req.params.id;
    if(!games[id]){
        req.flash('error', 'Game not found.');
        return res.redirect('/');
    }
    if(!req.session.username){
        req.flash('error', 'Please enter a username first.');
        return res.redirect('/');
    }
    
    console.log(`This are the current players: ${JSON.stringify(games[id].players)}`);
    return res.render('game/lobby', {id: id, players: JSON.stringify(games[id].players)});
});

router.post('/', function(req, res){
    var action = req.body.action;

    if(req.body.name === null || req.body.name === ""){
        req.flash("error", "Please enter a name.");
        return res.redirect("/");
    }

    req.session.username = req.body.name;

    //Join game
    if(action === "join"){
        var id = req.body.code;
        if(!games[id] || games[id] == undefined){
            req.flash('error', 'Game not found.');
            return res.redirect('/');
        }
        var game = games[id];
        var player = new Player(req.session.id, req.session.username, 'user');
        game.players.push(player);

        
        if(game.players.length >= game.maxPlayers){
            req.flash('error', "Game is full.");
            return res.redirect('/');
        }
        req.session.gameid = id;
        return res.redirect('/game/' + id);        
    }

    //Host game
    else if(action === "host"){
        // If there are no more game slots, we want to return.
        if(Object.keys(games).length >= MAX_GAMES){
            req.flash("error", "There are currently no more game slots. Try again later");
            return res.redirect('/');
        }

        id = makeid(5);
        req.session.gameid = id;
        games[id] = new Game(req.session.id, req.session.username, 'admin');
        req.flash('success', `Created game with id <b>${id}</b>.`);
        return res.redirect('/game/' + id);
    }

    //Error
    else{
        req.flash('error', 'Something went wrong');
        return res.redirect('/');
    }

});

//Constructors
function Game(hostId, hostName, role){
    this.admin = hostId;
    this.players = [];
    this.players[0] = new Player(hostId, hostName, role);
    this.maxPlayers = MAX_PLAYER;
    this.status = GAMESTATUS.LOBBY;
}

function Player(id, name, role){
    this.id = id;
    this.username = name;
    this.role = role;
}


//Helpers
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function containsUser(obj, list){
     for (let i = 0; i < list.length; i++) {
        if(list[i].username === obj.username) return true;
     }
     return false;
 }

 var clients = {};


 //Socket.io
 io.on('connection', (socket) => {
    socket.on('new user', (user) => {
        socket.join(user.gameid);
        clients[socket.id] = user;
        io.to(user.gameid).emit('connect message', {user: user, connected: true});

        //If the user is not in the games players array, add him.
        //This occurs when the player is reloading the page and does not fill out the form.
        if(!containsUser(user, games[user.gameid].players)) games[user.gameid].players.push(user);
    });

    socket.on('disconnect', () => {
      var user = clients[socket.id];
      if(!user || user == undefined) return;
      io.to(user.gameid).emit('connect message', {user: user, connected: false});

      delete clients[socket.id];

      //Removing user from game object
      var game = games[user.gameid];

      game.players = game.players.filter(el => el.id !== user.id);
    });

    socket.on('lobby message', (msg) =>{
        io.to(msg.gameid).emit('lobby message', msg);
    });
});

const GAMESTATUS = {
    LOBBY: 0,
    LIVE: 1,
    ENDED: 2
}

return router;
};