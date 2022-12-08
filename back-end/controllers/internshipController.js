const Internship = require("../models/internshipModel");

// function that checks for unusual position names and deletes them from the collection
async function deleteNonsense() {
  const internships = await Internship.find({}).sort({ createdAt: -1 });
  for (let i = 0; i < internships.length; i++) {
    if (internships[i].positionName.startsWith(" ")) {
      console.log(internships[i].positionName);
      await Internship.deleteOne({ id: internships[i].id });
    }
    if (internships[i].positionName.startsWith(", ")) {
      console.log(internships[i].positionName);
      await Internship.deleteOne({ id: internships[i].id });
    }
    if (internships[i].positionName.startsWith(" ,")) {
      console.log(internships[i].positionName);
      await Internship.deleteOne({ id: internships[i].id });
    }
    if (internships[i].positionName.startsWith(" (")) {
      console.log(internships[i].positionName);
      await Internship.deleteOne({ id: internships[i].id });
    }
    if (internships[i].positionName.startsWith(" or")) {
      console.log(internships[i].positionName);
      await Internship.deleteOne({ id: internships[i].id });
    }
    if (internships[i].positionName.startsWith(" program")) {
      console.log(internships[i].positionName);
      await Internship.deleteOne({ id: internships[i].id });
    }

  }
}

// getting all internships
async function getInternships() {
  // await deleteNonsense();
  const internships = await Internship.find({}).sort({ createdAt: -1 });
  return internships;
}

//get internship using id
async function getCompanyInternship(id) {
  const internship = await Internship.findById(id);
  return internship;
}

// check if Internship exists
async function checkIfExists(internship) {
  const { id, companyName, companyLogo, positionName, url, locations } =
    internship;
  const result = await Internship.findOne({
    companyName: companyName,
    positionName: positionName,
    url: url,
  });
  return result !== null;
}

// add Internship positions
async function addInternships(internships) {
  internships.forEach(async (internship) => {
    const { id, companyName, companyLogo, positionName, url, locations } =
      internship;
    try {
      const newInternship = await Internship.create({
        id,
        companyName,
        companyLogo,
        positionName,
        url,
        locations,
      });
    } catch (error) {
      // console.log("Error creating new Internship position", error.message);
      // console.log("new Internship details: ", internship);
    }
  });
}

//input company name and get all internship ids for that company
async function getInternshipIds(companyName) {
  const internships = await Internship.find({ companyName: companyName }).sort({
    createdAt: -1,
  });
  const data = [];
  internships.forEach((internship) => {
    data.push(internship._id);
  });

  return data;
}

// function that searches for and returns internships based on user input
async function searchInternships(searchTerm) {
  try {
    // const regex = new RegExp(searchTerm, "i");
    const allInternships = await Internship.find({}).sort({
      createdAt: -1,
    });
    const searchedInternships = allInternships.filter((internship) => {
      return internship.positionName.includes(searchTerm);
    });
    return searchedInternships;
  } catch (err) {
    console.log(err);
    return await searchInternships("");
  }
}

// exporting all functions
module.exports = {
  getInternships,
  checkIfExists,
  addInternships,
  getInternshipIds,
  getCompanyInternship,
  searchInternships,
};
