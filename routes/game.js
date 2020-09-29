const express       = require('express'),
      router        = express.Router();

const MAX_GAMES = 10;
const MAX_PLAYER = 6;
const ID_LENGTH = 5;

var games = {};

router.get('/', function(req, res){
    res.render("general/landing");
});

//Route to join or host games.
router.post('/join', function(req, res){
    var action = req.body.action;

    if(req.body.name === null || req.body.name === ""){
        req.flash("error", "Please enter a name.");
        return res.redirect("/");
    }

    //Join game
    if(action === "join"){
        var id = req.body.code;
        var game = games[id];
        console.log(game);

        if(!game){
            console.log("Game not found.");
            req.flash('error', 'Game not found.');
            return res.redirect('/');
        }
        else{
            return res.render('game/lobby', {id: id});
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
        return res.render('game/lobby', {id: id});
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

module.exports = router;