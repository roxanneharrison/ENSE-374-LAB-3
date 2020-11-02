//////////////////////////REQUIRE/////////////////////////
const functions = require(__dirname + "/functions.js");
const addTask = functions.addTask;
const addUser = functions.addUser;
const addNewItem = functions.addNewItem;
const fs = require("fs");

//////////////////////////JQUERY/////////////////////////
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//////////////////////EXPRESS JS////////////////////////
// get express and bring into project
const express = require("express");
// create an alias 
const app = express();
// create a port
const port = 3000;
// start listening
app.listen(port,
    function(){
        console.log("server is running on port " + port);
    });
const bodyParser = require("body-parser");
const { checkUsername, loginConfirmation, checkUser, readTasks, getNextTask, claim, unfinish, purge, abandonOrComplete } = require("./functions");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// setting ejs
app.set("view engine","ejs");

//////////////////////USER CLASS////////////////////////
class User {
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
  }

//////////////////////TASK CLASS////////////////////////
class Task {
    constructor(_id, name, owner, creator, done, cleared) {
      this._id = _id;
      this.name = name;
      this.owner = owner;
      this.creator = creator;
      this.done = done;
      this.cleared = cleared;
    }
  }

//////////////////////PATHS////////////////////////

// HOME PAGE
app.get("/",
function(req,res){
    res.render("index");
});
// LOGIN
app.post("/login", 
function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var confirmation = loginConfirmation(email, password);
    if(confirmation == true){
        res.redirect(307, "/todo")
    }else{res.redirect("/")}
});
// REGISTER
app.post("/register", 
function(req, res){
    var email = req.body.registerEmail;
    var password = req.body.registerPassword;
    var authentication = req.body.registerAuth;
    if(authentication == 1234){ 
        var exists = checkUser(email);
        if(exists == false){
            user = new User(email,password);
            addUser(user);
            res.redirect(307, "/todo")
        }else{res.redirect("/")}
    }else{res.redirect("/")}

});
// TO DO
app.post("/todo",
function(req,res){
    var email = req.body.email;
    var userId = req.body.userId;
    if((email == undefined)&(userId== undefined)){
    email = req.body.registerEmail}
    else if(email == undefined){email = req.body.userId};
    var title = "To Do List Title";
    res.render("todo", {title: title, email:email, taskList: readTasks()});
});
// CLAIM
app.post("/claim",
function(req,res){
    var email = req.body.email;
    var taskId = req.body.taskId;
    claim(taskId, email);
    res.redirect(307, "/todo")
});
// ABANDON OR COMPLETE
app.post("/abandonorcomplete",
function(req,res){
    var email = req.body.email;
    var taskId = req.body.taskId;
    var checkBox = req.body['checkboxId'+taskId];
    abandonOrComplete(taskId, checkBox);
    res.redirect(307, "/todo")
});
// ADD TASK
app.post("/addtask",
function(req,res){
var title = "To Do List Title";
   var email = req.body.userId;
   var addText = req.body.addText;
   var nextId = getNextTask();
   task= new Task(nextId,addText,"undefined",email,false,false);
   addTask(task);
   res.redirect(307, "/todo")
});
// UNFINISH
app.post("/unfinish",
function(req,res){
    var email = req.body.email;
    var taskId = req.body.taskId;
    unfinish(taskId);
    res.redirect(307, "/todo")
});
// PURGE
app.post("/purge",
function(req,res){
    var email = req.body.userId;
    var taskId = req.body.taskId;
    purge();
    res.redirect(307, "/todo")
});
// LOGOUT
app.get("/logout",
function(req,res){
    res.redirect("/");
});




