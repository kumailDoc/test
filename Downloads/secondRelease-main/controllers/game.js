let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

//create reference to the model (dbschema )
let Game = require("../models/game");

module.exports.displayGameInfo = (req, res, next) => {
  Game.find((err, gameInfo) => {
    if (err) {
      return console.error(err);
    } else {
      //console.log(gameInfo);

      res.render("game/list", {
        title: "Games",
        GameInfo: gameInfo,
        displayName: req.user ? req.user.displayName : "",
      });
      //render game.ejs and pass title and GameInfo variable we are passing gameInfo object to GameInfo property
    }
  });
};

module.exports.addpage = (req, res, next) => {
  res.render("bracket", {
    title: "Add Game",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.addprocesspage = (req, res, next) => {
  let newgame = Game({
    name: req.body.name,
    tType: req.body.tType,
    Included: req.body.Included,
    participant: req.body.participant,
    game: req.body.game,
  });
  Game.create(newgame, (err, Game) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //refresh the game-info
      res.redirect("/game-info");
    }
  });
};

module.exports.displayeditpage = (req, res, next) => {
  let id = req.params.id; //id of actual object

  Game.findById(id, (err, gametoedit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //show the edit view
      res.render("bracket", {
        title: "Edit Game",
        game: gametoedit,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

module.exports.processingeditpage = (req, res, next) => {
  let id = req.params.id; //id of actual object

  let updategame = Game({
    _id: id,
    name: req.body.name,
    tType: req.body.tType,
    Included: req.body.Included,
    participant: req.body.participant,
    game: req.body.game,
  });
  Game.updateOne({ _id: id }, updategame, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //refresh the game info
      res.redirect("/game-info");
    }
  });
};
module.exports.deletepage = (req, res, next) => {
  let id = req.params.id;
  Game.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //refresh game info
      res.redirect("/game-info");
    }
  });
};
