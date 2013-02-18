// 15-237 Unit Project Homework 4 - Get Monay Server

var express = require("express"); // imports express
var app = express();        // create a new instance of express

// imports the fs module (reading and writing to a text file)
var fs = require("fs");

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

// The global datastore for this example
var database;

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
  response.send({
    database: database,
    success: true
  });
});

// get one item
app.get("/database/:id", function(request, response){
  var id = request.params.id;
  var item = database[id];
  response.send({
    database: item,
    success: (item !== undefined)
  });
});

// create new item
app.post("/database", function(request, response) {
  console.log(request.body);
  var item = {"desc": request.body.desc,
              "author": request.body.author,
              "date": new Date(),
              "price": Number(request.body.price),
              "sold": false };

  var successful = 
      (item.desc !== undefined) &&
      (item.author !== undefined) &&
      (item.price !== undefined);

  if (successful) {
    database.push(item);
    writeFile("data.txt", JSON.stringify(database));
  } else {
    item = undefined;
  }

  response.send({ 
    item: item,
    success: successful
  });
});

// update one item
app.put("/database/:id", function(request, response){
  // change listing at index, to the new listing
  var id = request.params.id;
  var oldItem = database[id];
  var item = { "desc": request.body.desc,
               "author": request.body.author,
               "date": new Date(),
               "price": request.body.price,
               "sold": request.body.sold };
  item.desc = (item.desc !== undefined) ? item.desc : oldItem.desc;
  item.author = (item.author !== undefined) ? item.author : oldItem.author;
  item.price = (item.price !== undefined) ? item.price : oldItem.price;
  item.sold = (item.sold !== undefined) ? JSON.parse(item.sold) : oldItem.sold;

  // commit the update
  database[id] = item;

  response.send({
    item: item,
    success: true
  });
});

// delete entire list
app.delete("/database", function(request, response){
  database = [];
  writeFile("data.txt", JSON.stringify(database));
  response.send({
    database: database,
    success: true
  });
});

// delete one item
app.delete("/database/:id", function(request, response){
  var id = request.params.id;
  var old = database[id];
  database.splice(id, 1);
  console.log(id);
  writeFile("data.txt", JSON.stringify(database));
  response.send({
    database: old,
    success: (old !== undefined)
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
