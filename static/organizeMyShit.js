
//global datastore
var database;

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
      window.location = $(this).attr('href', "calendar.html") + '?sessionid=user.val()';
      //window.location.href = ;
      calendar.init(user.val());
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

var calendar = {
  init: function(user) {
    console.log(user);
    calendar.user = user;
  }

  

}


function addClass() {
	var user = $("#user-input");
	var category = $("#category-input");
	var className = $("#className-input");
	addClassToServer(user.val(), category.val(), className.val());

	var newClass = {"category": category.val(),
                  "className": className.val(),
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













$(document).ready(function() {
    getAll();
    index.init();
    var pathname = window.location.pathname;
    console.log(pathname);
  });


