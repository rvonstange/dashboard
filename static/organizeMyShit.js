
//global datastore
var database;

function manageBar() {
  var calendar = $("#calendarBar");
  calendar.click(function(){
    window.location.href = 'calendar.html#' + encodeURI(userString);
  });
  var listings = $("#listingsBar");
  listings.click(function(){
    window.location.href = 'listings.html#' + encodeURI(userString);
  });
  var addClasses = $("#classBar");
  console.log("addclass: ", addClasses);
  var hello = addClasses.html();
  console.log(hello);
  addClasses.click(function(){
    console.log("i come here!");
    window.location.href = 'addClass.html#' + encodeURI(userString);
  });
  var addEvents = $("#eventBar");
  addEvents.click(function(){
    window.location.href = 'addEvent.html#' + encodeURI(userString);
  });
}

var index = {
  init: function() {
    index.invalidUser = false;
    index.invalidPass = false;
  },

  login: function() {
    var user = $("#user-input");
    var password = $("#password-input");
    console.log(user.val(), password.val(), user.val() in database, database[user.val()]);
    if ((user.val() in database) && (database[user.val()].password === password.val())) {
      console.log("im here shit");
      //window.location = $(this).attr('href', "calendar.html") + '?sessionid=user.val()';
      window.location.href = 'calendar.html#' + encodeURI(user.val());
      //calendar.init(user.val());
    }
    else {
      if (!(user.val() in database)) index.invalidUser = true;
      else index.invalidPass = true;
      index.refreshLogin();
    }
  },

  refreshLogin: function() {
    var container = $("#loginFail");
    container.html("");
    if (index.invalidUser) {
      container.html("Invalid Username or Password");
    }
    if (index.invalidPass) {
      container.html("Invalid Password");
    }

  }

}

var signup = {
  init: function() {
    signup.signup();
  },

  signup: function() {
    signup.userTaken = false;
    signup.passDiff = false;
    var user = $("#username");
    var firstName = $("#first");
    var lastName = $("#last");
    var college = $("#college");
    var password1 = $("#password1");
    var password2 = $("#password2");
    if (password2.val() !== password1.val()) signup.passDiff = true;
    if (user.val() in database) signup.userTaken = true;
    if (signup.passDiff === false && signup.userTaken === false) {
      console.log("i should add user");
      var newUser = {first: firstName.val(),
                    last: lastName.val(),
                    college: college.val(),
                    password: password1.val()};
      database[user.val()] = newUser;
      signup.addUser(user.val(), newUser);
      //window.location.href = 'calendar.html#' + encodeURI(user.val());
    }
    signup.refreshSignup();
  },

  addUser: function(user, data) {
    $.ajax({
    type: "post",
    data: {"user": user, "data": data},
    url: "/database/newUser",
    success: function(data) { 
      window.location.href = 'calendar.html#' + encodeURI(user);
    }
  });
  },

  refreshSignup: function() {
    var container1 = $("#message1");
    var container2 = $("#message2");
    container1.html("");
    container2.html("");
    if (signup.userTaken) {
      container1.html("Username taken. Sorry!");
    }
    if (signup.passDiff) {
      // var thisHTML = container.html();
      // console.log("thishtml = ", container.html());
      container2.html("Passwords do not match!");
    }
  }
}



var calendar = {
  init: function() {
    console.log("im in calendar.init")
    manageBar();
  }
}

var addEvent = {
  init: function() {
    manageBar();
  },

  add: function() {}
}

var addClass = {
  init: function() {
    manageBar();
  }
}

var listings = {
  init: function() {
    manageBar();
  }
}

function addClass() {
	var user = $("#user-input");
	var category = $("#category-input");
	var className = $("#className-input");
	addClassToServer(user.val(), category.val(), className.val());

	var newClass = {"category": category.val(),
                  "name": className.val(),
                  "events": []};

    database.user.val().classes.push(newClass);
    user.val("");
    category.val("");
    className.val("");
    refreshDOM();
}

function addEvent() {
  var user = $("#user-input");
  var className = $("#className-input");
  var eventName = $("#eventName-input");
  var type = $("#eventType-input");
  var priority = $("#priority-input");
  var due = new Date();
  var times = $(".times");
  var workTime = [];
  for (i = 0; i < times.length; i++) {
    workTime.push({'start': times[i].start,
                  'end': times[i].end})
  }
  var newEvent = {"name": eventName.val(),
                  "type": type.val(),
                  "due": due,
                  "priority": priority,
                  "workTime": workTime };
  addEventToServer(user.val(), className.val(), newEvent);

  var classIndex = database.user.val().classes.indexOf(className.val());
  database.user.val().classes[classIndex].events.push(newEvent);
}

function addEventToServer(user, thisClass, event) {
  $.ajax({
    type: "post",
    data: {"user": user, "class": thisClass, "event": event},
    url: "/database/event",
    success: function(data) {
      //blah
    }
  });
}

function addClassToServer(user, category, name) {
  $.ajax({
    type: "post",
    data: {"user": user, "category": category, "name": name},
    url: "/database",
    success: function(data) { 
      //refreshDOM();
    }
  });
}

function getAll() {
    $.ajax({
      type: "get",
      url: "/database",
      success: function(data) {
        database = data.database;
        console.log(database);
        //refreshDOM();
      }
    });
  }

function getProfile(user) {
    $.ajax({
      type: "get",
      url: "/database/" + user,
      success: function(data) {
        database[user] = data.profile;
        console.log(data.profile);
        refreshDOM();
      }
    });
  }

function delClass(user, className) {
  $.ajax({
    type: "delete",
    url: "/database/" + user,
    data: {"className": className},
    success: function(data) {
      database[user] = data.profile;
      console.log(data.profile);
      //refreshDOM();
    }
  })
}

function delEvent(user, className, eventName) {
  $.ajax({
    type: "delete",
    url: "/database/" + user + "/" + className,
    data: {"eventName": eventName},
    success: function(data) {
      database[user] = data.profile;
      console.log(data.profile);
    }
  })
}



function editEvent() {
  var user = $("#user-input");
  var className = $("#className-input");
  var oldEventname;
  var eventName = $("#eventName-input");
  var type = $("#eventType-input");
  var priority = $("#priority-input");
  var due = new Date();
  var times = $(".times");
  var workTime = [];
  for (i = 0; i < times.length; i++) {
    workTime.push({'start': times[i].start,
                  'end': times[i].end})
  }
  var classIndex = getClassIndex(user, className.val());
  var eventIndex = getEventIndex(user, classIndex, oldEventname.val());

  var newEvent = {"name": eventName.val(),
                  "type": type.val(),
                  "due": due,
                  "priority": priority,
                  "workTime": workTime };
  editEventOnServer(user.val(), className.val(), newEvent, eventIndex);

  
  database.user.val().classes[classIndex].events[eventIndex] = newEvent;
}

function editEventOnServer(user, className, event, index) {
  $.ajax({
    type: "put",
    data: {"user": user, "className": className, "event": event, "index": index},
    url: "/database/event",
    success: function(data) {
      //blah
    }
  });
}

function editClass () {
  
}

function editClassOnServer() {
  // body...
}

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









// function addCurrent(user) {
//   $.ajax({
//     type: "post",
//     data: {"user": user},
//     url: "/database/current",
//     success: function(data) { 
//       //refreshDOM();
//     }
//   });
// }

// function updateCurrent() {
//   var user = window.location.href.slice(window.location.href.indexOf("#")+1);
//   console.log(user);
//   database["current"] = user;

// }



function checkLocation() {
  var pathname = window.location.pathname;
  var pages = ["index", "signup", "addClass", "addEvent", "calendar", "listings"];
  var currentState = undefined;
  for (i = 0; i < pages.length; i++) {
    if (pathname.indexOf(pages[i]) !== -1) {
      currentState = pages[i];
    }
  }
  return currentState;
}

function manageState(state) {
  if (state === "index") index.init();
  if (state === "signup") signup.init();
  if (state === "addClass") addClass.init();
  if (state === "addEvent") addEvent.init();
  if (state === "calendar") calendar.init();
  if (state === "listings") listings.init();
}

$(document).ready(function() {
    getAll();
    //console.log("path = ", pathname);
    //var data = stringManipulationOn(window.location.href);
    var userIndex = window.location.href.indexOf("#");
    //console.log(userIndex);
    userString = undefined;
    if (userIndex !== -1) userString = window.location.href.slice(userIndex+1);
    console.log("user = ", userString);
    currentState = checkLocation();
    console.log("state = ", currentState);
    manageState(currentState);
   });


