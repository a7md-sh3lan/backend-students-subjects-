
const subjectRouter = require("express").Router(),
Student = require("../Models/Student"),
Subject = require("../Models/Subject");


subjectRouter.get("/", (req, res)=>{
    Subject.find({})
    .then((subjects)=>{
        res.send(subjects);
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    });
});


subjectRouter.get("/:id", (req, res)=>{
    Subject.findOne({_id: req.params.id})
    .then((subject)=>{
        Student.find({subjects: {$elemMatch: {subject: subject._id}}}, {name: 1, age: 1, _id: 1, "subjects.$": 1})
        .then((students)=>{
            res.send(students);
            console.log("Find Subject..");
            console.log(students);
        })
        .catch((err)=>{
            console.log("Error in finding the students ", err);
            res.send(err);
        });
    })
    .catch((err)=>{
        console.log("Can't find subject ", err);
        res.send(err);
    });
});

subjectRouter.post("/edit/:id", (req, res)=>{
    Subject.updateOne({_id: req.params.id}, {$set: {name: req.body.name}})
    .then((result)=>{
        res.send({updated: true});
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
});


subjectRouter.post("/add", (req, res)=>{
    let sub = new Subject({
        _id: req.body._id,
        name: req.body.name,
    });
    sub.save((err)=>{
        if(err){
            console.log("Error... ", err);
            res.send(err);
            return;
        }
        res.send(sub);
    });
});

subjectRouter.get("/delete/:id", (req, res)=>{
    Subject.deleteOne({_id: req.params.id})
    .then((err)=>{
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        res.send({deleted: true});
    });
});



module.exports = subjectRouter;
