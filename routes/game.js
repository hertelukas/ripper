const express       = require('express'),
      router        = express.Router();



module.exports = function(io, server){
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
    //TODO check if this user is even in this lobby

    
    return res.render('game/lobby', {id: id});

})

router.post('/', function(req, res){
    var action = req.body.action;
    console.log(req.body);

    if(req.body.name === null || req.body.name === ""){
        req.flash("error", "Please enter a name.");
        return res.redirect("/");
    }

    //Join game
    if(action === "join"){
        var id = req.body.code;
        var game = games[id];

        if(!game){
            req.flash('error', 'Game not found.');
            return res.redirect('/');
        }
        else{
            return res.redirect('/game/' + id);
        }
    }

    //Host game
    else if(action === "host"){
        console.log("Hosting new game...");

        // If there are no more game slots, we want to return.
        if(Object.keys(games).length >= MAX_GAMES){
            req.flash("error", "There are currently no more game slots. Try again later");
            return res.redirect('/');
        }

        id = makeid(5);
        games[id] = new Game();
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
function Game(){
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

 //Socket.io
 io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('lobby message', (msg) =>{
        io.emit('lobby message', msg);
    })
  });

return router;
};