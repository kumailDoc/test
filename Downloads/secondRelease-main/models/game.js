let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

//create a model class
let gameModel = mongoose.Schema(
  {
    name: String,
    tType: String,
    Included: String,
    participant: Number,
    game: String,
  },

  {
    collection: "games",
  }
);

//booksmodel to create new book more powerful than just class
module.exports = mongoose.model("Game", gameModel);
