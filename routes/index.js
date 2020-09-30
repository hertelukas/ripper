const express       = require('express'),
      router        = express.Router();

router.get('/', function(req, res){
    res.render("general/landing", {gameid: req.session.gameid, username: req.session.username});
});

module.exports = router;