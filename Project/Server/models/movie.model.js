const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    language: {
      type: String,
      required: true,
    },

    posterPath: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    ratings:{
        type:Number
    }
  },
  { timestamps: true }
);

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;