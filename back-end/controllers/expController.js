const Exp = require('../models/expModel');
const { v4: uuidv4 } = require("uuid");

// fucntion to find all projects added by a user to their profile
async function projList(email) {
    const projects = await Exp.find({ user: email, type: 'Proj' }).sort({ createdAt: -1 });
    return projects;
}

// fucntion to find all experiences added by a user to their profile
async function expList(email) {
    const experiences = await Exp.find({ user: email, type: 'Work' }).sort({ createdAt: -1 });
    return experiences;
}

// function to add a new experience to the user's profile section
async function addExp(exp) {
    try {
        const newExp = await Exp.create({
            user: exp.user,
            type: exp.type,
            id: uuidv4(),
            title: exp.title,
            org: exp.org,
            date: exp.date,
            text: exp.text,
        });
        return newExp;
    }
    catch (error) {
        console.log("Error creating new experience", error.message);
        console.log("new experience details: ", exp);
    }
}

// function to edit an existing user experience in the profile section
async function editExp(exp) {
    try {
        const updatedExp = await Exp.replaceOne({id: exp.id}, {
            user: exp.user,
            type: exp.type,
            id: exp.id,
            title: exp.title,
            org: exp.org,
            date: exp.date,
            text: exp.text,
        });
    }
    catch (error) {
        console.log("Error updating experience", error.message);
        console.log("updated experience details: ", exp);
    }
}

// function to remove an existing user experience in the profile section
async function removeExp(id) {
    try {
        const deletedExp = await Exp.deleteOne({id: id});
    }
    catch (error) {
        console.log("Error deleting experience", error.message);
        console.log("deleted experience id: ", id);
    }
}

// exporting all functions
module.exports = {
    projList,
    expList,
    addExp,
    editExp,
    removeExp,
};