const fs = require("fs");
var jsdom = require("jsdom");
const { finished } = require("stream");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
// var $ = require('jquery')(require("jsdom").jsdom().parentWindow);


function readUsers(){ // returns json object with users in it
    var data = fs.readFileSync(__dirname + "/user.json", 'utf8');
    var obj = JSON.parse(data); //now it an object
    return obj;
}

function readTasks(){ // returns json object with tasks in it
    var data = fs.readFileSync(__dirname + "/task.json", 'utf8');
    var obj = JSON.parse(data); //now it an object
    return obj;
}

function addUser(user){
// get user object
var obj = readUsers();
// get username from new entry
var checkUsername = user.username;
// check if it exists
var exists = checkUser(checkUsername);
// add new user if it doesn't exist already
if(exists == false){
    obj.push(user); //add some data
    fs.writeFile(__dirname + "/user.json", JSON.stringify(obj), 'utf8',  
    function(err){ // error handler
        if(err){
            console.log(err); // log error
           }
       }); // write it back 
}
}

function addTask(task){
// get task object
var obj = readTasks();
// get task id from new entry
var checkTaskId = task._id;
// check if it exists
var exists = checkTask(checkTaskId);
// add new task if it doesn't exist already
if(exists == false){
    obj.push(task); //add some data
    fs.writeFile(__dirname + "/task.json", JSON.stringify(obj), 'utf8',  
    function(err){ // error handler
        if(err){
            console.log(err); // log error
           }
       }); // write it back 
}
}

function checkUser(checkUsername){ // returns true if user exists
// get user object
var obj = readUsers();

    // check if username exists in entries
    var result = false;
    for (var key in obj) {
        var keyUsername = obj[key].username;
        if(keyUsername == checkUsername){
        if(result == false){
            result = true;
        }}
    }
    return result;

}


function checkPass(checkUsername, checkPassword){ // returns true if username matches password
    // get user object
    var obj = readUsers();
    
 
    var match = false;
    for (var key in obj) {
        var keyUsername = obj[key].username;
        var keyPassword = obj[key].password;

        if((keyUsername == checkUsername) & (keyPassword == checkPassword)){
        if(match == false){
            match = true;
        }}
    }    
    

    return match;
}


function loginConfirmation(checkUsername, checkPassword){ // return true if confirmed
var exists = checkUser(checkUsername); // check if username exists
if(exists == true){
 var match = checkPass(checkUsername, checkPassword); // check if password matches
 return match;
} else return false;
}

function checkTask(checkTaskId){ // returns true if task exists
    // get task object
    var obj = readTasks();
        // check if task id exists in entries
        var result = false;
        for (var key in obj) {
            var keyId = obj[key]._id;
            if(keyId == checkTaskId){
            if(result == false){
                result = true;
            }}
        }
        return result;
    
    }

    function getNextTask(){ // returns value of next id to add
        // get task object
        var obj = readTasks();
        // get max id value
            var result = 0;
            for (var key in obj) {
                var keyId = obj[key]._id;
                if(keyId > result){
                    result = keyId;
                }
            }
            return result + 1;
        
        }
 
    function claim(taskId, userId){ 
        // get task object
        var obj = readTasks();

        // update owner to current user
        for (var key in obj) {
            var keyId = obj[key]._id;

            if((keyId == taskId)){
                obj[key].owner = userId;
            }
        }   
        // update the task file
        fs.writeFile(__dirname + "/task.json", JSON.stringify(obj), 'utf8',  
        function(err){ // error handler
            if(err){
                console.log(err); // log error
               }
           }); // write it back 

    }

    function unfinish(taskId){ 
        // get task object
        var obj = readTasks();

        // update done to false
        for (var key in obj) {
            var keyId = obj[key]._id;

            if((keyId == taskId)){
                obj[key].done = false;
            }
        }   
        // update the task file
        fs.writeFile(__dirname + "/task.json", JSON.stringify(obj), 'utf8',  
        function(err){ // error handler
            if(err){
                console.log(err); // log error
               }
           }); // write it back 

    }

    function finish(taskId){ 
        // get task object
        var obj = readTasks();

        // update done to true
        for (var key in obj) {
            var keyId = obj[key]._id;

            if((keyId == taskId)){
                obj[key].done = true;
            }
        }   
        // update the task file
        fs.writeFile(__dirname + "/task.json", JSON.stringify(obj), 'utf8',  
        function(err){ // error handler
            if(err){
                console.log(err); // log error
               }
           }); // write it back 

    }
    function abandon(taskId){ 
        // get task object
        var obj = readTasks();

        // update owner to undefined
        for (var key in obj) {
            var keyId = obj[key]._id;

            if((keyId == taskId)){
                obj[key].owner = "undefined";
            }
        }   
        // update the task file
        fs.writeFile(__dirname + "/task.json", JSON.stringify(obj), 'utf8',  
        function(err){ // error handler
            if(err){
                console.log(err); // log error
               }
           }); // write it back 

    }

    function purge(){ 
        // get task object
        var obj = readTasks();

        // update done cleared to true
        for (var key in obj) {
            var keyDone = obj[key].done;

            if((keyDone == true)){
                obj[key].cleared = true;
            }
        }   
        // update the task file
        fs.writeFile(__dirname + "/task.json", JSON.stringify(obj), 'utf8',  
        function(err){ // error handler
            if(err){
                console.log(err); // log error
               }
           }); // write it back 

    }

    function abandonOrComplete(taskId, checkBox){ 
        if(checkBox == 'on'){
            finish(taskId);
        }else{abandon(taskId);}
    }




exports.addUser = addUser;
exports.addTask = addTask;
exports.checkUser = checkUser;
exports.readUsers = readUsers;
exports.readTasks = readTasks;
exports.loginConfirmation = loginConfirmation;
exports.checkPass = checkPass;
exports.checkTask = checkTask;
exports.getNextTask = getNextTask;
exports.claim = claim;
exports.unfinish = unfinish;
exports.purge = purge;
exports.abandonOrComplete = abandonOrComplete;
