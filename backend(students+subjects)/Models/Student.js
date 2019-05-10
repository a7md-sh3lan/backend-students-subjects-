
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      path = require("path");

let Student = new Schema({
    _id: Number,
    name: String,
    age: Number,
    subjects: [{
        subject: {
            type: Number,
            ref: "subjects"
        },
        degree: Number
    }]
});


module.exports = mongoose.model("students", Student);



module.exports.hasSubject = function(student, subjectID){
    for(subject of student.subjects){
        if(subject.subject == subjectID) return true;
    }
    return false;
}

module.exports.separateNewSubjects = function(student, subjects){
    let newSubjectIDs = [], oldSubjectIDs = [];
    subjects.forEach((subject)=>{
        if(module.exports.hasSubject(student, subject))
            oldSubjectIDs.push(subject);
        else newSubjectIDs.push(subject);
    });
    return {newSubjectIDs, oldSubjectIDs};
}

