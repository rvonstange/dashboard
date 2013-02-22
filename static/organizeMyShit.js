
//global datastore
var database;

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
    workTime.push({'start': times[i].start
                  'end': times[i].end})
  }
  var newEvent = {"name": eventName.val(),
                  "type": type.val(),
                  "due": due,
                  "priority": priority,
                  "workTime": workTime};
  addEventToServer(user.val(), className.val(), newEvent);

  var classIndex = database.user.val().classes.indexOf(className.val());
  database.user.val().classes[classIndex].events.push(newEvent);

}

function addEventToServer(user, class, event) {
  $.ajax({
    type: "post",
    data: {'user': user, 'class': class, 'event': event},
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
        //console.log(listings);
        refreshDOM();
      }
    });
  }

function getProfile(user) {
    $.ajax({
      type: "get",
      url: "/database/" + user,
      success: function(data) {
        database[user] = data.profile;
        //console.log(listings);
        refreshDOM();
      }
    });
  }



function refreshDOM() {}

























$(document).ready(function() {
    get();
  });