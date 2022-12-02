require("dotenv").config();
const express = require("express"); // CommonJS import style!
const app = express(); // instantiate an Express object
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
// var cors = require('cors');
const mystery = "https://github.com/pittcsc/Summer2023-Internships";
const bodyParser = require("body-parser");
const Internship = require("./models/internshipModel");
const internshipController = require("./controllers/internshipController");
const companyController = require("./controllers/companyController");
const reviewController = require("./controllers/reviewController");
const userController = require("./controllers/userController");
const applicationController = require("./controllers/applicationController");
const {
  signupUser,
  loginUser,
} = require("./controllers/authenticationControler");
const expController = require("./controllers/expController");

const jsonParser = bodyParser.json();
//var reviews = require('./reviews.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function scrape(url) {
  let companiesWithPositions = [];
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const elemSelector =
      "#readme > div.Box-body.px-5.pb-5 > article > table > tbody > tr";
    $(elemSelector).each((parentIdx, parentElem) => {
      const companyNameElem = $(parentElem).children()[0];
      const locationsElem = $(parentElem).children()[1];
      const positionsElem = $(parentElem).children()[2];
      if (
        !$(positionsElem).text().includes("Closed") &&
        !$(locationsElem).text().includes("Closed")
      ) {
        let companyData = {};
        companyData["companyName"] = $(companyNameElem).text();
        if ($(companyNameElem).children().length > 0) {
          companyData["defaultPositionUrl"] = $(companyNameElem)
            .find("a")
            .attr("href");
        }
        companyData["locations"] = $(locationsElem).text();
        companyData["positions"] = [];
        $(positionsElem)
          .contents()
          .each((posIdx, posElem) => {
            if (
              posElem.type === "text" &&
              companyData["defaultPositionUrl"] !== undefined
            ) {
              companyData["positions"].push({
                id: uuidv4(),
                title: $(posElem).text(),
                url: companyData["defaultPositionUrl"],
              });
            } else if (posElem.type === "tag" && posElem.name === "a") {
              companyData["positions"].push({
                id: uuidv4(),
                title: $(posElem).text(),
                url: posElem.attribs["href"],
              });
            }
          });
        companiesWithPositions.push(companyData);
      }
    });
  } catch (error) {
    return companiesWithPositions;
  }
  return companiesWithPositions;
}

async function fetchDescriptionAndLogo(companyName) {
  companyName = companyName.replaceAll(" ", "+");
  url =
    "https://api.simplify.jobs/v2/company/?page=0&size=27&value=" + companyName;
  let res = {};
  try {
    const { data } = await axios.get(url);
    if (
      "items" in data &&
      data.items.length > 0 &&
      "description" in data.items[0] &&
      data.items[0].description !== null
    ) {
      res["description"] = data.items[0].description;
    } else {
      res["description"] = "";
    }

    if (
      "items" in data &&
      data.items.length > 0 &&
      "logo" in data.items[0] &&
      data.items[0].logo !== null
    ) {
      res["logo"] = data.items[0].logo;
    } else {
      res["logo"] = "";
    }
  } catch (error) {
    console.log(
      `Error fetching company description and logo: ${error.message}`
    );
  }

  return res;
}

// app.use(cors())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  next();
});


app.get("/get_companies", async (req, res) => {
  const companies = await companyController.getCompanies();
  // companies.forEach(async (company) => {
  //   // console.log(company);
  // });
  res.status(200).send(companies);
  let companiesToPositions = await scrape(mystery);
  let newCompanies = [];
  let internshipIds = [];
  let reviewids = [];

  for (i = 0; i < companiesToPositions.length; i++) {
    let company = companiesToPositions[i];
    const { description, logo } = await fetchDescriptionAndLogo(
      company.companyName
    );

    internshipIds = await internshipController.getInternshipIds(
      company.companyName
    );

    let companyobj = {
      companyPositions: internshipIds,
      companyName: company.companyName,
      locations: company.locations,
      description: description,
      logo: logo,
      reviewids: reviewids,
    };

    const exists = await companyController.checkIfExists(companyobj);
    if (!exists) {
      newCompanies.push(companyobj);
    }
  }

  //console.log(newInternships.length);
  await companyController.addCompanies(newCompanies);
});

app.post("/get_company_internships", jsonParser, async (req, res) => {
  const internships = [];
  const ids = req.body.companyPositions;
  for (i = 0; i < ids.length; i++) {
    const internship = await internshipController.getCompanyInternship(ids[i]);
    internships.push(internship);
  }
  // console.log(internships);
  res.send(internships);
});

app.get("/get_internships", async (req, res) => {
  const internships = await internshipController.getInternships();
  res.status(200).send(internships);

  let companiesToPositions = await scrape(mystery);
  let newInternships = [];
  for (i = 0; i < companiesToPositions.length; i++) {
    let company = companiesToPositions[i];
    const { description, logo } = await fetchDescriptionAndLogo(
      company.companyName
    );

    await company.positions.map(async (position) => {
      let internship = {
        id: position.id,
        companyName: company.companyName,
        companyLogo: logo,
        positionName: position.title,
        url: position.url,
        locations: company.locations,
      };
      const exists = await internshipController.checkIfExists(internship);
      if (!exists) {
        newInternships.push(internship);
      }
    });
  }
  // console.log(newInternships.length);
  await internshipController.addInternships(newInternships);
});


app.post("/search_internships", jsonParser, async (req, res) => {
  // console.log(`searching ${req.body.params.searchTerm}`);
  const internships = await internshipController.searchInternships(
    req.body.params.searchTerm
  );

  // console.log(internships);
  res.status(200).send(internships);
});

app.post("/search_companies", jsonParser, async (req, res) => {
  // console.log(`searching ${req.body.params.searchTerm}`);
  const internships = await companyController.searchCompanies(
    req.body.params.searchTerm
  );

  // console.log(internships);
  res.status(200).send(internships);
});


app.post("/post_expArr", jsonParser, async (req, res) => {
  let exp3 = [await expController.expList(req.body.email), await expController.projList(req.body.email)];
  res.send(exp3);
});

app.post("/get_work", jsonParser, async (req, res) => {
  // req.body.entry.id = String(new Date());
  res.send(await expController.addExp(req.body.entry));
  // workExp.push(req.body.entry);
  // res.send(req.body.entry); //DIFENRECE
});

app.post("/get_proj", jsonParser, async (req, res) => {
  // req.body.entry.id = String(new Date());
  // proj.push(req.body.entry);
  res.send(await expController.addExp(req.body.entry));
  // res.send(req.body.entry);
});

app.post("/post_edit", jsonParser, async (req, res) => {
  await expController.editExp(req.body.entry);
  // for (let i = 0; i < workExp.length; i++) {
  //   if (workExp[i].id === req.body.entry.id) {
  //     workExp[i] = req.body.entry;
  //     break;
  //   }
  // }
});

app.post("/post_userEmail", jsonParser, async (req, res) => {
  res.send(await userController.getUserByEmail(req.body.email));
});

app.post("/post_review", async (req, res) => {
  const Reviewdata = [];
  Reviewdata.push(req.body);
  res.send({ Reviewdata });
  // console.log({ Reviewdata });
});


app.post("/get_reviews", jsonParser, async (req, res) => {
  const reviews = [];
  const Reviewids = req.body.reviewids;
  // console.log(Reviewids);

for(let i=0;i<Reviewids.length;i++){
      const review = await reviewController.getReview(Reviewids[i]);
      const user = await userController.getUser(review.user);
      let reviewObj = {
        name: user.firstName,
        review: review.review,
        rating: review.rating,
        date: review.date,
        position: review.position,
        company : review.company

      };
      reviews.push(reviewObj);
    }

  // console.log(reviews);
  res.send(reviews);
});


app.post("/login", loginUser);

app.post("/signup", signupUser);

const appData = [];
app.post("/post_applications", jsonParser, async (req, res) => {
  appData.push(req.body);

  console.log(req.body.params);
  await applicationController.addApplication(req.body.params);

  // res.send({ appData });
  // console.log({ appData });
});

app.post("/get_applications", jsonParser, async (req, res) => {
  const applications = await applicationController.getApplications(req.body.user);
  res.status(200).send(applications);
});

module.exports = app;


// Bufixes
// 1. Add a new company to the database
// 2. Add a new internship to the database
// 3. Add a new review to the database