// 15-237 Unit Project Homework 4 - Homework Server

var express = require("express"); // imports express
var app = express();        // create a new instance of express

// imports the fs module (reading and writing to a text file)
var fs = require("fs");

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

// The global datastore for this example
var database;

function getClassIndex(user, className) {
  var classIndex = undefined;
  for (i = 0; i < database[user].classes.length; i++) {
    if (database[user].classes[i].name === className) {
      classIndex = i;
    }
  }
  return classIndex;
}

function getEventIndex(user, classIndex, eventName) {
  var eventIndex = undefined;
  for (j = 0; j < database[user].classes[classIndex].events.length; j++) {
    if (database[user].classes[classIndex].events[j].name === eventName) {
      eventIndex = j;
    }
  }
  return eventIndex;
}

// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

// get all items
app.get("/database", function(request, response){
  console.log(database["shubhit"]);
  response.send({
    database: database,
    success: true
  });
});

// get one item
app.get("/database/:user", function(request, response){
  var user = request.params.user;
  var profile = database[user];
  console.log(profile, "type: ", typeof profile);

  response.send({
    profile: profile,
    success: (profile !== undefined)
  });
});

// create new item
app.post("/database", function(request, response) {
  //console.log(request.body);
  var user = request.body.user;
  console.log("user = ", user, ", database[user] = ", database[user]);
  var newClass = {"category": request.body.category,
                  "name": request.body.name,
                  "events": []};

  var successful = 
      (newClass.category !== undefined) &&
      (newClass.name !== undefined);

  if (successful) {
    database[user].classes.push(newClass);
    writeFile("data.txt", JSON.stringify(database));
  } else {
    newClass = undefined;
  }

  response.send({ 
    class: newClass,
    success: successful
  });
});

app.post("/database/event", function(request, response) {
  console.log(request.body);
  var event = request.body.event;
  var user = request.body.user;
  var thisClass = request.body.class;
  // var newClass = {"category": request.body.category,
  //                 "name": request.body.name,
  //                 "events": {}};

  var successful = 
      (event !== undefined) &&
      (user !== undefined) &&
      (thisClass !== undefined);

  var classIndex = -1;
  for (i = 0; i < database[user].classes.length; i++) {
    if (database[user].classes[i].name === thisClass) classIndex = i;
  }
  console.log(classIndex);
  if (successful) {
    database[user].classes[classIndex].events.push(event);
    writeFile("data.txt", JSON.stringify(database));
  } else {
    event = undefined;
  }

  response.send({ 
    event: event,
    success: successful
  });
});

// update one item
app.put("/database/event", function(request, response){
  // change listing at index, to the new listing
  var user = request.body.user;
  var className = request.body.className;
  var event = request.body.event;
  var eventIndex = request.body.index;
  
  var classIndex = getClassIndex(user, className);
  database.user.val().classes[classIndex].events[eventIndex] = newEvent;
  var successful = (classIndex !== undefined) && (eventIndex !== undefined);

  response.send({
    success: successful
  });
});

// delete class
app.delete("/database/:user", function(request, response){
  var user = request.params.user;
  var className = request.body.className;
  console.log("request.body: ", request.body);
  classIndex = undefined;
  for (i = 0; i < database[user].classes.length; i++) {
    if (database[user].classes[i].name === className) {
      classIndex = i;
    }
  }

  var successful = classIndex !== undefined;
  console.log("successful? ", successful);
  if (successful) {
    database[user].classes.splice(classIndex, 1);
    writeFile("data.txt", JSON.stringify(database));
  }
  
  response.send({
    database: database,
    success: successful
  });
});

// delete event
app.delete("/database/:user/:className", function(request, response){
  var user = request.params.user;
  var className = request.params.className;
  eventName = request.body.eventName;
  classIndex = undefined;
  eventIndex = undefined;
  for (i = 0; i < database[user].classes.length; i++) {
    if (database[user].classes[i].name === className) {
      classIndex = i;
      for (j = 0; j < database[user].classes[i].events.length; j++) {
        if (database[user].classes[i].events[j].name === eventName) {
          eventIndex = j;
        }
      }
    }
  }
  var successful = (classIndex !== undefined) && (eventIndex !== undefined);
  if (successful) {
    database[user].classes[classIndex].events.splice(eventIndex, 1);
    writeFile("data.txt", JSON.stringify(database));
  }
  response.send({
    database: database,
    success: successful
  });
});

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

function initServer() {
  // When we start the server, we must load the stored data
  var defaultList = "[]";
  readFile("data.txt", defaultList, function(err, data) {
    database = JSON.parse(data);
  });
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
