const express = require("express");
const Show = require("../models/show.model.js");
const isAuth = require('../middlewares/authMiddleware.js');
const { requirePartnerOrAdmin } = require('../middlewares/roleMiddleware.js');

const showRouter = express.Router(); // Route

// create a show (Partner or Admin)
showRouter.post("/add-show", isAuth, requirePartnerOrAdmin, async (req, res) => {
  try {
    // Security: Partners can only add shows to their own theatres
    if (req.user.role === 'partner' && req.body.theatre) {
      const Theatre = require("../models/theatre.model.js");
      const theatre = await Theatre.findById(req.body.theatre);
      if (theatre && theatre.owner.toString() !== req.userId) {
        return res.send({
          success: false,
          message: "Access denied. You can only add shows to your own theatres."
        });
      }
    }
    
    const newShow = new Show(req.body);
    await newShow.save();
    res.send({
      success: true,
      message: "New show has been added!",
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});

// Delete Show (Partner or Admin)
showRouter.post("/delete-show", isAuth, requirePartnerOrAdmin, async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId).populate('theatre');
    if (!show) {
      return res.send({
        success: false,
        message: "Show not found"
      });
    }
    
    // Security: Partners can only delete shows from their own theatres
    if (req.user.role === 'partner' && show.theatre.owner.toString() !== req.userId) {
      return res.send({
        success: false,
        message: "Access denied. You can only delete shows from your own theatres."
      });
    }
    
    await Show.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: "The show has been deleted!",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Update show (Partner or Admin)
showRouter.put("/update-show", isAuth, requirePartnerOrAdmin, async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId).populate('theatre');
    if (!show) {
      return res.send({
        success: false,
        message: "Show not found"
      });
    }
    
    // Security: Partners can only update shows from their own theatres
    if (req.user.role === 'partner' && show.theatre.owner.toString() !== req.userId) {
      return res.send({
        success: false,
        message: "Access denied. You can only update shows from your own theatres."
      });
    }
    
    await Show.findByIdAndUpdate(req.body.showId, req.body);
    res.send({
      success: true,
      message: "The show has been updated!",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// get all shows and theatres for a movie

// Get all theatres by movie (Public route - users need to see available shows)
showRouter.post("/get-all-theatres-by-movie", async (req, res) => {
  try {
    const { movie, date } = req.body;
    const shows = await Show.find({ movie, date }).populate('theatre');

    // we need to map the shows with unique theatres

    // Filter out shows by uniue theatres

    let uniqueTheatres = [];

    shows.forEach((show) => {
      let isTheatre = uniqueTheatres.find(
        (theatre) => theatre._id === show.theatre._id
      );

      if (!isTheatre) {
        let showsOfThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );

        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsOfThisTheatre,
        });
      }
    });

    res.send({
      success: true,
      message: "Shows Fetched",
      shows: uniqueTheatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Shows not Fetched",
    });
  }
});

// get-show-by-id (Public route - anyone can view show details)
showRouter.post("/get-show-by-id", async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId).populate("movie").populate('theatre');
    res.send({
      success: true,
      message: "Show fetched!",
      data: show,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

showRouter.post("/get-all-shows", isAuth, requirePartnerOrAdmin, async (req, res) => {
  try {
    // Security: Partners can only see shows from their own theatres
    if (req.user.role === 'partner' && req.body.thearteId) {
      const Theatre = require("../models/theatre.model.js");
      const theatre = await Theatre.findById(req.body.thearteId);
      if (theatre && theatre.owner.toString() !== req.userId) {
        return res.send({
          success: false,
          message: "Access denied. You can only view shows from your own theatres."
        });
      }
    }
    
    const allShows = await Show.find({ theatre: req.body.thearteId })
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      message: "All Shows Fetched",
      data: allShows,
    });
  } catch (error) {
    res.send({
      success: false,
      message: `Not able to fetch Shows ${error}`,
    });
  }
});

module.exports = showRouter;