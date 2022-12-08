const Application = require("../models/applicationModel");
const { v4: uuidv4 } = require("uuid");

// get all Applications
async function getApplications(email) {
    const applications = await Application.find({user:email}).sort({ createdAt: -1 });
    return applications;
}

// get a specific application for a user using internshipID
async function getSpecApplication(email, id) {
    const app = await Application.find({user: email, internshipID: id});
    return app;
}

// create a new Application
async function addApplication(application) {
    const { user, internshipID, internshipURL, companyName, companyLogo, positionName, locations, status } =
    application;
    try {
    const newApplication = await Application.create({
        user,
        internshipID,
        internshipURL,
        companyName,
        companyLogo,
        positionName,
        locations,
        status,
        reviews,
        notes: []
    });
    } catch (error) {
    console.log("Error creating new Application", error.message);
    console.log("new Application details: ", application);
    };
}

async function updateapplication(entry) {
    //find application using _id and update it
    console.log(entry);
    const app =  await Application.updateOne({ "_id": entry._id }, {$set: entry});
    console.log(app);
    return app;
}

//delete application
async function deleteapplication(id) {
    const app = await Application.findByIdAndDelete(id);
    return app;
}

//helper function for addNote
async function notesList(email, id) {
    const notes = await Application.find({ user: email, internshipID: id});
    return notes[0].notes;
}

// function to update an application's notes section whenever a new note is added
async function addNote(email, id, entry) {
    const app = (await getSpecApplication(email, id))[0];
    const newNote = { id: uuidv4(), title: entry.title, date: entry.date, text: entry.text }
    try {
        const updatedApp = await Application.replaceOne({user: email, internshipID: id}, {
            user: app.user,
            internshipID: app.internshipID,
            internshipURL: app.internshipURL,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            positionName: app.positionName,
            locations: app.locations,
            status: app.status,
            reviews: app.reviews,
            notes: [...app.notes, newNote]
        });
        return newNote;
    }
    catch (error) {
        console.log("Error updating experience", error.message);
        console.log("updated experience details: ", exp);
    }    
}

// function to allow editing of an existing note
async function editNote(email, id, entry) {
    const notes = await notesList(email, id);
    const newNotesList = notes.map(note => {
        if (note.id == entry.id) {
            return entry;
        }
        return note;
    });

    const app = (await getSpecApplication(email, id))[0];

    try {
        const updatedApp = await Application.replaceOne({user: email, internshipID: id}, {
            user: app.user,
            internshipID: app.internshipID,
            internshipURL: app.internshipURL,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            positionName: app.positionName,
            locations: app.locations,
            status: app.status,
            reviews: app.reviews,
            notes: newNotesList
        });
    }
    catch (error) {
        console.log("Error updating experience", error.message);
        console.log("updated experience details: ", exp);
    }    
}

// function to allow deletion of an existing note
async function delNote(email, id, entry) {
    
    let notes = await notesList(email, id); 

    // finding the note to be deleted and then removing it from the notes list
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == entry.id) {
            notes.splice(i, 1);
        }
    }

    const app = (await getSpecApplication(email, id))[0];

    // updating the notes array which now excludes the deleted note
    try {
        const updatedApp = await Application.replaceOne({user: email, internshipID: id}, {
            user: app.user,
            internshipID: app.internshipID,
            internshipURL: app.internshipURL,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            positionName: app.positionName,
            locations: app.locations,
            status: app.status,
            reviews: app.reviews,
            notes: notes
        });
    }
    catch (error) {
        console.log("Error updating experience", error.message);
        console.log("updated experience details: ", exp);
    }    
}

// exporting all functions
module.exports = {
    getApplications,
    addApplication,
    notesList,
    addNote,
    editNote,
    updateapplication,
    deleteapplication,
    delNote,
};