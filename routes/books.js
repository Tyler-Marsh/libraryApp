const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function to wrap each route. */
/* makes code cleaner by omitting try catch in each route an addditional time */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // THIS GETS LOGGED
      console.log(error, "asyncHandler")
      // res.status(500).send(error);
      res.status(500).send(error)
    }
  }
}

/* ROUTE TO INDEX PAGE*/

router.get('/', function (req, res, next) {
  res.redirect('/books');
}); 
/*

/*GET ALL BOOKS */
router.get('/books', asyncHandler(async (req, res) => {
    books = await Book.findAll();
    res.render("index", {books, title: "Library App"});
}));


/* ROUTE TO UPDATE BOOK */
router.get('/books/update',  (req, res, next) => {
  res.render("update-book");
});


// /books/new
/* ROUTE TO NEW BOOK FORM */

router.get('/books/new',  (req, res) => {
  res.render("new-book", {book: {}, title: "New Book"});
});

/* ADD A NEW BOOK */

router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  }
  catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("new-book", {book, errors: error.errors})

    }
    else {
      throw error
    }
  }
}));

/* SEND TO UPDATE BOOK FORM */

router.get("/books/:id", asyncHandler(async ( req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", {book, title: book.title });  
  } else {
    //res.render('page-not-found');
    // trying to use next to forward the error
    // to the global error handler.
    next();
  }
}
)); 

/* UPDATE A BOOK */

router.post("/books/:id", asyncHandler( async (req, res,) => {
  let book; 
  try {
    book = await Book.findByPk(req.params.id)
    if(book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  }
  catch (error) {
    if(error.name === "SequelizeValidationError") {
     book = await Book.build(req.body);
     book.id = req.params.id;
     res.render("update-book", {book, errors: error.errors})
    }
  }
}));


/* DELETE A BOOK */

router.post("/books/:id/delete", asyncHandler( async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/books");
}));

module.exports = router;