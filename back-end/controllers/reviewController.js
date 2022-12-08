const Review = require("../models/reviewModel");
// get review using id
async function getReview(id) {
  const review = await Review.findById(id);
  return review;
}

// function to add a new review
async function addReview(Data) {

  // Data contains review info from user input
  const { user, company, review, rating, position, date } = Data;
  try {
    // creating a new review document
    const newReview = await Review.create({
      user,
      company,
      review,
      rating,
      position,
      date,
    });
    console.log(newReview);
    return newReview;
  } catch (error) {
    console.log("Error creating new review", error.message);
    console.log("new review details: ", review);
  }
}

// exporting all functions
module.exports = {
  getReview,
  addReview,
};
