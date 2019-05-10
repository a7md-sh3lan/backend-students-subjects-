
const app = require("express")(),
      mongoose = require("mongoose"),
      morgan = require("morgan"),
      bodyParser = require("body-parser"),
      path = require("path"),
      cors = require("cors"),
      studentRouter = require("./Routes/StudentRouter"),
      subjectRouter = require("./Routes/subjectRouter");


mongoose.connect("mongodb://localhost:27017/studentsDB").then((db)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("Error occured during connecting to the database ", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(morgan("short"));

app.use(cors());
//error middleware
app.use((err, req, res, next)=>{
    console.log(err);
    res.send(err);
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.use("/students", studentRouter);
app.use("/subjects", subjectRouter);


app.listen(process.env.PORT || 8080, (err)=>{
    if(!err)
        console.log("Listening...");
});