var express = require('express');
var router = express.Router();

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}


// put this route inside books.js to see if it works



module.exports = router;
