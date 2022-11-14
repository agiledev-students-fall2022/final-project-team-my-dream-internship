const express = require("express"); // CommonJS import style!
const app = express(); // instantiate an Express object
const cheerio = require("cheerio");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
// var cors = require('cors');
const mystery = "https://github.com/pittcsc/Summer2023-Internships";
const bodyParser = require("body-parser");
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
            if (posElem.type === "text") {
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
    "https://api.simplify.jobs/v2/company/?page=0&size=2&value=" + companyName;
  const { data } = await axios.get(url);
  let res = {};

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

app.get("/get_test", async (req, res) => {
  let companiesToPositions = await scrape(mystery);
  res.send(companiesToPositions);
});

app.get("/get_companies", async (req, res) => {
  let companiesToPositions = await scrape(mystery);
  let companies = [];
  for (i = 0; i < companiesToPositions.length; i++) {
    let company = companiesToPositions[i];
    const { description, logo } = await fetchDescriptionAndLogo(
      company.companyName
    );
    let companyobj = {
      companyName: company.companyName,
      url: company.url,
      locations: company.locations,
      description: description,
      logo: logo,
    };
    companies.push(companyobj);
  }
  res.send(companies);
});

app.get("/get_internships", async (req, res) => {
  let resultLength =
    "maxLen" in req.query ? req.query["maxLen"] : companiesToPositions.length;
  let companiesToPositions = await scrape(mystery);
  let internships = [];
  for (let i = 0; i < resultLength; i++) {
    let company = companiesToPositions[i];
    const { description, logo } = await fetchDescriptionAndLogo(
      company.companyName
    );
    company.positions.map((position) => {
      let internship = {
        id: position.id,
        companyName: company.companyName,
        companyLogo: logo,
        positionName: position.title,
        url: position.url,
        locations: company.locations,
      };
      internships.push(internship);
    });
  }

  res.send(internships);
});

////////// OBJECTS FOR TESTING

let Reviews = [
  {
    user: "Majid",
    review: "Good experience",
    rating: "4",
    date: "1/1/2001",
    position: "SWE",
  },
  {
    user: "Zaeem",
    review: "bad.",
    rating: "1",
    date: "2/2/2002",
    position: "Data Analyst",
  },
  {
    user: "Soumen",
    review: "mid",
    rating: "3",
    date: "3/3/2003",
    position: "Janitor",
  },
];

let workExp = [
  {
    title: "Research Assistant",
    org: "New York University",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Research Assistant",
    org: "New York University",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Research Assistant",
    org: "New York University",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Research Assistant",
    org: "New York University",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];
let proj = [
  {
    title: "Hello World",
    org: "Python",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Hello World",
    org: "Python",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Hello World",
    org: "Python",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Hello World",
    org: "Python",
    date: "Aug 2021 - Dec 2021",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

//////////////////////

app.get("/get_expArr", async (req, res) => {
  let exp3 = [workExp, proj];
  res.send(exp3);
});

app.get("/get_reviews", jsonParser, async (req, res) => {
  // https://my.api.mockaroo.com/reviews.json?key=69437d10
  //const reviews = await axios.get("https://my.api.mockaroo.com/reviews.json?key=69437d10");
  res.send(Reviews);
  // console.log(Reviews);
});

app.post("/get_work", jsonParser, async (req, res) => {
  workExp.push(req.body.entry);
  res.send(req.body.entry);
});

app.post("/get_proj", jsonParser, async (req, res) => {
  proj.push(req.body.entry);
  res.send(req.body.entry);
});

app.post("/get_proj", jsonParser, async (req, res) => {
  console.log(req.body.proj);
});

app.post("/post_review", async (req, res) => {
  const Reviewdata = [];
  Reviewdata.push(req.body);
  res.send({ Reviewdata });
  console.log({ Reviewdata });
});

app.post("/get_login", jsonParser, (req, res) => {
  if (req.body.params.password == "password") {
    res.send("success");
  } else {
    res.send("failure");
  }
});

module.exports = app;
