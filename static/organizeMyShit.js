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
      var newUser = {
                    first: firstName.val(),
                    last: lastName.val(),
                    college: college.val(),
                    password: password1.val()
                    };
      console.log("newuser = ", newUser);
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



var cal = {
  init: function() {
    console.log("im in cal.init")
    manageBar();
    cal.canvas = $("#calendarCanvas")[0];
    cal.ctx = cal.canvas.getContext("2d");
    console.log("canvas = ", cal.canvas, ", ctx = ", cal.ctx);
    cal.width = cal.canvas.width;
    cal.height = cal.canvas.height;
    cal.leftMargin = 48;
    cal.topMargin = 70;
    cal.dayWidth = (cal.width - cal.leftMargin) / 7;
    cal.drawGrid();
    cal.drawDays();
    cal.drawDates();
  },

  drawDates: function() {
    var dates = ["1", "2", "3", "4", "5", "6", "7"];
    dates.forEach(function(element, i) {
      cal.ctx.font = "bold 20px Times";
      cal.ctx.textAlign = "center";
      cal.ctx.fillText(element, cal.leftMargin + (cal.dayWidth / 2) + cal.dayWidth*i, (2/5)*cal.topMargin);
    })
  },

  drawDays: function () {
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    days.forEach(function(element, i) {
      cal.ctx.font = "15px Times";
      cal.ctx.textAlign = "center";
      cal.ctx.fillText(element, cal.leftMargin + (cal.dayWidth / 2) + cal.dayWidth*i, (4/5)*cal.topMargin);
    })
  },

  drawGrid: function() {
    for (i = 0; i < 7; i++) {
      cal.ctx.beginPath();
      cal.ctx.moveTo(cal.leftMargin + cal.dayWidth*i, 0);
      cal.ctx.lineTo(cal.leftMargin + cal.dayWidth*i, cal.height);
      cal.ctx.closePath();
      cal.ctx.stroke();
    }
    cal.ctx.beginPath();
    cal.ctx.moveTo(0, cal.topMargin);
    cal.ctx.lineTo(cal.width, cal.topMargin);
    cal.ctx.closePath();
    cal.ctx.stroke();
    //cal.ctx.fillRect(0, 0, cal.width, cal.height);
  }
}

var addEvent = {
  init: function() {
    manageBar();
    //console.log("database = ", database);
    for (var i = 0; i < database[userString].classes.length; i++) {
      var newOption = $("<option>");
      var myOptions = $("[name='groups']");
      newOption.html(database[userString].classes[i]["name"]);
      newOption.val(database[userString].classes[i]["category"]);
      myOptions.append(newOption);
    }
    //myOptions.onChange(addEvent.refreshAddEvent());
    addEvent.refreshAddEvent();
  },

 refreshAddEvent: function () {
    var classOptions = ["","Office Hours", "Homework", "Exam", "Quiz", "Lecture"];
    var myOptions = $("#chooseClass");
    for (var i = 0; i < myOptions[0].length; i++) {
      if (myOptions[0][i].selected === true) {
        var type = myOptions[0][i].value;
        console.log(myOptions[0][i]);
        console.log(myOptions[0]);
      }
    }
      var myTypeOptions = $("#chooseEventType");
      
      if (type === "organization") {
        $("#eventTable").find("tr:gt(3)").remove();
        myTypeOptions.empty();
        var activity = $("<option>");
        activity.html("Activity");
        myTypeOptions.append(activity);
        addEvent.createTimeChoice();
        addEvent.recurringEvent();
        $('#recurNo').change(function() {
          $("#eventTable").find("tr:gt(5)").remove();
          if ($('#recurNo').val() === "no") addEvent.createDays();
        });
        $('#recurYes').change(function() {
          $("#eventTable").find("tr:gt(5)").remove();
          if ($('#recurYes').val() === "yes") addEvent.createCalendarChoice();
        });
      }
      else if (type === "class") {
        $("#eventTable").find("tr:gt(3)").remove();
        myTypeOptions.empty();        
        for (var j = 0; j < classOptions.length; j++) {
          var newClassOption = $("<option>");
          newClassOption.html(classOptions[j]);
          myTypeOptions.append(newClassOption);
        }      
      }
      $('#chooseClass').change(function() {
        addEvent.refreshAddEvent();
      });

//This is used to change the page based on the type of event chosen
      // for (var k = 0; k < myTypeOptions[0].length; k++) {
      // if (myTypeOptions[0][k].selected === true) {
      //   var eventToAdd = myTypeOptions[0][k].html;
      //   console.log(myTypeOptions[0][k]);

      // }
    //}
      $('#chooseEventType').change(function() {
        addEvent.refreshLowerEventPage();
      });


    console.log("myOptions[0][0].selected = ", $("select#chooseEventType option:eq(0)").text());
  },
    hwDueTime: function() {
    var startHour = $("<select>");
    startHour.attr("id", "Hour");
    var hourOptions = [ ,1,2,3,4,5,6,7,8,9,10,11,12];
    for (var i = 0; i < hourOptions.length; i++) {
        var newHourOption = $("<option>");
        newHourOption.html(hourOptions[i]);
        startHour.append(newHourOption);
    } 
    var startMinute = $("<select>");
    startMinute.attr("id", "Minute");
    var minuteOptions = [ ,"00","15","30","45"];
    for (var j = 0; j < minuteOptions.length; j++) {
        var newMinuteOption = $("<option>");
        newMinuteOption.html(minuteOptions[j]);
        startMinute.append(newMinuteOption);
    }

    var startAMPM = $("<select>");
    startAMPM.attr("id", "AMPM");
    var ampmOptions = ["AM","PM"];
    for (var k = 0; k < ampmOptions.length; k++) {
        var newAMPMOption = $("<option>");
        newAMPMOption.html(ampmOptions[k]);
        startAMPM.append(newAMPMOption);
    }
    
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    newRow.attr("id", "hwDueTime");
    var startMeeting = $("<td>");
    startMeeting.html("Time Due:");
    newRow.append(startMeeting);
    newRow.append(startHour);
    newRow.append(startMinute);
    newRow.append(startAMPM);
    eventTable.append(newRow);
  },

  createTimeChoice: function() {
    var startHour = $("<select>");
    var endHour = $("<select>");
    startHour.attr("id", "startHour");
    endHour.attr("id", "endHour");
    var hourOptions = [ ,1,2,3,4,5,6,7,8,9,10,11,12];
    for (var i = 0; i < hourOptions.length; i++) {
        var newHourOption = $("<option>");
        newHourOption.html(hourOptions[i]);
        var newHourOption2 = $("<option>");
        newHourOption2.html(hourOptions[i]);
        startHour.append(newHourOption);
        endHour.append(newHourOption2);
    }   
    var startMinute = $("<select>");
    var endMinute = $("<select>");
    startMinute.attr("id", "startMinute");
    endMinute.attr("id", "endMinute");
    var minuteOptions = [ ,"00","15","30","45"];
    for (var j = 0; j < minuteOptions.length; j++) {
        var newMinuteOption = $("<option>");
        newMinuteOption.html(minuteOptions[j]);
        var newMinuteOption2 = $("<option>");
        newMinuteOption2.html(minuteOptions[j]);
        startMinute.append(newMinuteOption);
        endMinute.append(newMinuteOption2);
    }

    var startAMPM = $("<select>");
    var endAMPM = $("<select>");
    startAMPM.attr("id", "startAMPM");
    endAMPM.attr("id", "endAMPM");
    var ampmOptions = ["AM","PM"];
    for (var k = 0; k < ampmOptions.length; k++) {
        var newAMPMOption = $("<option>");
        newAMPMOption.html(ampmOptions[k]);
        var newAMPMOption2 = $("<option>");
        newAMPMOption2.html(ampmOptions[k]);
        startAMPM.append(newAMPMOption);
        endAMPM.append(newAMPMOption2);
    }
    
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    newRow.attr("id", "meetingTimes");
    var startMeeting = $("<td>");
    startMeeting.html("Start Time:");
    newRow.append(startMeeting);
    newRow.append(startHour);
    newRow.append(startMinute);
    newRow.append(startAMPM);
    var endMeeting = $("<td>");
    endMeeting.html("End Time:");
    newRow.append(endMeeting);
    newRow.append(endHour);
    newRow.append(endMinute);
    newRow.append(endAMPM);
    eventTable.append(newRow);
  },

  recurringEvent: function() {
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    var question = $("<td>");
    question.html("One Time Event?");
    var buttons = $("<td>");
    buttons.attr("class","buttons");
    buttons.append('<input type="radio" id="recurYes" name="recur" value="yes" />Yes');
    buttons.append('<input type="radio" id="recurNo" name="recur" value="no" />No');
    newRow.append(question);
    newRow.append(buttons);
    eventTable.append(newRow);
  },

  recitation: function() {
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    var question = $("<td>");
    question.html("Recitation?");
    var buttons = $("<td>");
    buttons.attr("class","buttons");
    buttons.append('<input type="radio" id="recitationYes" name="recitation" value="yes" />Yes');
    buttons.append('<input type="radio" id="recitationNo" name="recitation" value="no" />No');
    newRow.append(question);
    newRow.append(buttons);
    eventTable.append(newRow);
  },

  createDays: function () {
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    var question = $("<td>");
    question.html("Choose Days: ");
    var buttons = $("<td>");
    var satButton = $("<td>");
    buttons.attr("class","buttons");
    buttons.append('<input type="checkbox" value="sunday" />Sun');
    buttons.append('<input type="checkbox" value="monday" />M');
    buttons.append('<input type="checkbox" value="tuesday" />T');
    buttons.append('<input type="checkbox" value="wednesday" />W');
    buttons.append('<input type="checkbox" value="thursday" />Th');
    buttons.append('<input type="checkbox" value="friday" />F');
    satButton.append('<input type="checkbox" value="saturday" />Sat');
    newRow.append(question);
    newRow.append(buttons);
    newRow.append(satButton);
    eventTable.append(newRow);

  },

  createCalendarChoice: function(message) {
    if (message === undefined) message = "Choose Day: ";
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    var question = $("<td>");
    question.html(message);
    var calendar = $("<td>");
    calendar.append('<input type="date" name="dayOfEvent" />');
    newRow.append(question);
    newRow.append(calendar);
    eventTable.append(newRow);
  },

  refreshLowerEventPage: function () {
    //Office Hours
    var myTypeOptions = $("#chooseEventType");
    for (var i = 0; i < myTypeOptions[0].length; i++) {
      if (myTypeOptions[0][i].selected === true) {
        var name = $("select#chooseEventType option:eq(" + i + ")").text();
      }
    }
    $("#eventTable").find("tr:gt(3)").remove();
    if ((name === "Exam") || (name === "Quiz")){
      addEvent.createTimeChoice();
      addEvent.createCalendarChoice();
    }
    else if (name === "Office Hours") {
        addEvent.createTimeChoice();
        addEvent.recurringEvent();
        $('#recurNo').change(function() {
          $("#eventTable").find("tr:gt(5)").remove();
          if ($('#recurNo').val() === "no") addEvent.createDays();
        });
        $('#recurYes').change(function() {
          $("#eventTable").find("tr:gt(5)").remove();
          if ($('#recurYes').val() === "yes") addEvent.createCalendarChoice();
        });
    }
    else if (name === "Lecture") {
      addEvent.createTimeChoice();
      addEvent.createDays();
      addEvent.recitation();
      $('#recitationNo').change(function() {
          $("#eventTable").find("tr:gt(6)").remove();
          });
      $('#recitationYes').change(function() {
          $("#eventTable").find("tr:gt(6)").remove();
          if ($('#recitationYes').val() === "yes") {
            addEvent.createTimeChoice();
            addEvent.createDays();
          }
        });
    }
    else if (name === "Homework") {
      addEvent.createCalendarChoice("Due Date: ");
      addEvent.hwDueTime();
    }

  },

  addEvent: function() {
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
  },

  addEventToServer: function (user, thisClass, event) {
    $.ajax({
      type: "post",
      data: {"user": user, "class": thisClass, "event": event},
      url: "/database/event",
      success: function(data) {
        //blah
      }
    });
  }
}

var addClass = {
  init: function() {
    manageBar();
  },

  addClass: function() {
    var user = userString;
    var categoryOptions = $(".classCategory");
    var className = $("#className");
    if (categoryOptions[0].checked === true) {
      var category = categoryOptions[0];
    } else if (categoryOptions[1].checked === true) {
      var category = categoryOptions[1];
    }
    console.log(user, category.value, className.val());
    addClass.addClassToServer(user, category.value, className.val());

    var newClass = {"category": category.value,
                    "name": className.val(),
                    "events": []};
    if (database[user].classes === undefined) database[user].classes = [];
    database[user].classes.push(newClass);
    className.val("");
    addClass.refreshAddClass();
  },

  addClassToServer: function (user, category, name) {
    $.ajax({
      type: "post",
      data: {"user": user, "category": category, "name": name},
      url: "/database",
      success: function(data) { 
        //refreshDOM();
      }
    });
  },

  refreshAddClass: function() {

  }
}

var listings = {
  init: function() {
    manageBar();
  }
}







function getAll() {
    $.ajax({
      type: "get",
      url: "/database",
      success: function(data) {
        database = data.database;
        console.log("data.database getAll = ", data.database);
        console.log("database getAll = ", database);
        itIsReady();
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
  if (state === "calendar") cal.init();
  if (state === "listings") listings.init();
}

$(document).ready(function() {
    getAll();
    //console.log("path = ", pathname);
    //var data = stringManipulationOn(window.location.href);
   });

function itIsReady () {
  var userIndex = window.location.href.indexOf("#");
    console.log("database = ", database);
    userString = undefined;
    if (userIndex !== -1) userString = window.location.href.slice(userIndex+1);
    console.log("user = ", userString);
    currentState = checkLocation();
    console.log("state = ", currentState);
    manageState(currentState);
}
