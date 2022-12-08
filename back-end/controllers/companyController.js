const Company = require('../models/companyModel');

// getting all companies
async function getCompanies() {
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return companies;
}

// function to check if a company exists in the database
async function checkIfExists(company) {
    const { companyName} = company;
    const result = await Company.findOne({
        companyName: companyName,
    });
    return result !== null;
}

// function to add new companies to the database
async function addCompanies(companies) {
    companies.forEach(async (company) => {
        const { companyName, logo, companyDescription, url,companyPositions,locations,reviewids } = company;
        try {
            const newCompany = await Company.create({
                companyName,
                logo,
                companyDescription,
                url,
                locations,
                companyPositions,
                reviewids
            });
        } catch (error) {
            console.log("Error creating new company", error.message);
            console.log("new company details: ", company);
        }
    });
}

// update company reviews
async function updateCompanyReviews(name,reviewid) {
    const company = await Company.findOneAndUpdate({companyName: name},{$push:{reviewids: reviewid}});
    console.log(reviewid);
    console.log(company);
}

// get company by name
async function getCompanyByinternshipname(name) {
    const company = await Company.findOne({companyName: name});
    return company;
}

// function that searches for and returns companies based on user input
async function searchCompanies(searchTerm) {
    try{
        const regex = new RegExp(searchTerm, "i");
        const companies = await Company.find({
            companyName: regex,
        }).sort({ createdAt: -1 });
        
          return companies;
    }
    catch(err){
        console.log(err);
        return await searchCompanies("");
    }

    }

// exporting all functions
module.exports = {
    getCompanies,
    checkIfExists,
    addCompanies,
    updateCompanyReviews,
    searchCompanies,
    getCompanyByinternshipname
};