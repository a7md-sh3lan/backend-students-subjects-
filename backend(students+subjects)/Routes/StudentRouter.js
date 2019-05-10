
const studentRouter = require("express").Router(),
      Student = require("../Models/Student"),
      Subject = require("../Models/Subject");

console.log(Student.separateNewSubjects)
studentRouter.get("/", (req, res)=>{
    Student.find({})
    .then((students)=>{
        res.send(students);
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    });
});


studentRouter.get("/:id", (req, res)=>{
    Student.findOne({_id: req.params.id})
    .populate({path: "subjects.subject"}) //, select: "name -_id"
    .then((student)=>{
        res.send(student);
        console.log("Find Student..")
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    });
});


studentRouter.post("/add", (req, res)=>{
    let std = new Student({
        _id: req.body._id,
        name: req.body.name,
        age: req.body.age,
        subjects: []
    });
    std.save((err)=>{
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        res.send(std);
    });
});

studentRouter.post("/edit/:id", (req, res)=>{
    Student.updateOne({_id: req.params.id}, {$set: {
        name: req.body.name,
        age: req.body.age,

    }})
    .then((result)=>{
        res.send({updated: true});
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
});


studentRouter.get("/delete/:id", (req, res)=>{
    Student.deleteOne({_id: req.params.id})
    .then((err)=>{
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        res.send({deleted: true});
    });
});

studentRouter.post("/assign", (req, res)=>{
    //req.body ===> {studentsIDs: [Numbers...], subjectIDs: [numbers]}
    Student.find({_id: {$in: req.body.studentIDs}})
    .then((students)=>{
        students.forEach((student)=>{
            let subjectsIDs = [...new Set(req.body.subjectIDs)];
            let {newSubjectIDs} = Student.separateNewSubjects(student, subjectsIDs);            
            let newSubjects = newSubjectIDs.map((s)=>{ return {subject: s, degree: 0} });
            Student.updateOne({_id: student._id}, {
                $push: { //addToSet
                    subjects: {$each: newSubjects}
                }
            }).then(console.log("uodated student " + student._id));
        });

    }).then(()=>{
        res.send({updated: true});
    }).catch((err)=>{
        console.log("Error during update: ", err);
        res.send({updated: false});
    });
});

studentRouter.post("/:id/grade", (req, res)=>{
    Student.updateOne({_id: req.params.id, subjects: {$elemMatch: {subject: req.body.subject}}}, {
        $set: {"subjects.$.degree": req.body.degree}
    })
    .then(()=>{
        console.log("updated grade");
        res.send({updated: true})
    })
    .catch((err)=>{
        console.log(err);
        res.send({updated: false})
    });
});

studentRouter.delete("/:id/subject/:subject", (req, res)=>{
    Student.updateOne({_id: req.params.id}, {$pull: {subjects: {subject: req.params.subject}}})
    .then(()=>{
        console.log("deleted!");
        res.send({deleted: true});
    })
    .catch((err)=>{
        console.log(err);
        res.send({deleted: false});
    });
});
module.exports = studentRouter;
