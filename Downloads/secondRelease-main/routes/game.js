let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let passport = require("passport");

let gameController = require("../controllers/game");

//helpter function for guard purposes
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

/* GET Route for the Game Info page - READ OPeration */
router.get("/", gameController.displayGameInfo);

/* GET Route for displaying Add page - Create OPeration */
router.get("/add", requireAuth, gameController.addpage);

/* POST Route for processing Add page - Create OPeration */
router.post("/add", requireAuth, gameController.addprocesspage);

/* GET Route for displaying Edit page -UPDATE OPeration */
router.get("/edit/:id", requireAuth, gameController.displayeditpage);

/*POST Route for processing Edit page - UPDATE OPeration */
router.post("/edit/:id", requireAuth, gameController.processingeditpage);

/* GET to perform game deletion -Delete OPeration */
router.get("/delete/:id", requireAuth, gameController.deletepage);

module.exports = router;
