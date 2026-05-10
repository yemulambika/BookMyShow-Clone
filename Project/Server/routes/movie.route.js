const express = require('express')
const Movie = require('../models/movie.model.js');
const { addMovie, updateMovie } = require('../controllers/movie.controllers.js');
const isAuth = require('../middlewares/authMiddleware.js');
const { requireAdmin } = require('../middlewares/roleMiddleware.js');


const movieRouter = express.Router(); // Route


// Add a Movie (Admin only)
movieRouter.post('/add-movie', isAuth, requireAdmin, addMovie)



// update movie (Admin only)
movieRouter.put('/update-movie/', isAuth, requireAdmin, updateMovie)




// Delete Movie (Admin only)
movieRouter.delete('/delete-movie/:id', isAuth, requireAdmin, async(req , res)=>{
    try {
     const movieId = req.params.id
     const movie = await Movie.findByIdAndDelete(movieId , req.body)
       res.send({
            success: true,
            message: 'The movie has been updated!',
            data: movie
        })
    } catch (error) {
           res.send({
            success: false,
            message: 'Server Error'
        })
    }

})


// get all Movies
movieRouter.get('/all-movies' , async(req , res)=>{
      try {
         const allMovies =  await Movie.find()
         res.send({
            success: true,
            message: 'All movies have been fetched!',
            data: allMovies
        });

      } catch (error) {
          res.send({
            success: false,
            message: error.message
        });
      }
})

// get a specific Movie

movieRouter.get('/:id' , async(req , res)=>{
    try {
        const movie = await Movie.findById(req.params.id)
         res.send({
            success: true,
            message: "Movie fetched successfully!",
            data: movie
        })
    } catch (error) {
           res.send({
            success: false,
            message: err.message
        })
    }
})





module.exports =movieRouter;



