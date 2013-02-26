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
    cal.hourHeight = 40;
    cal.fiftHeight = cal.hourHeight / 4;
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
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    days.forEach(function(element, i) {
      cal.ctx.font = "15px Times";
      cal.ctx.textAlign = "center";
      cal.ctx.fillText(element, cal.leftMargin + (cal.dayWidth / 2) + cal.dayWidth*i, (4/5)*cal.topMargin);
    })
  },

  drawGrid: function() {
    //draw verticle day lines
    for (var i = 0; i < 7; i++) {
      cal.ctx.beginPath();
      cal.ctx.moveTo(cal.leftMargin + cal.dayWidth*i, 0);
      cal.ctx.lineTo(cal.leftMargin + cal.dayWidth*i, cal.height);
      cal.ctx.closePath();
      cal.ctx.stroke();
    }
    for (var i = 0; i < 24; i++) {
      //draw horizontal hour lines
      cal.ctx.beginPath();
      cal.ctx.moveTo(cal.leftMargin, cal.topMargin + cal.hourHeight*i);
      cal.ctx.lineTo(cal.width, cal.topMargin + cal.hourHeight*i);
      cal.ctx.closePath();
      cal.ctx.lineWidth = 1;
      cal.ctx.stroke();
      //draw time text on left margin
      cal.ctx.font = "12px Times";
      cal.ctx.textAlign = "center";
      var timeString = String(i);
      var stamp = " AM";
      if (i == 0) timeString = "12";
      if (i > 11) stamp = " PM";
      if (i > 12) timeString = String(i - 12);
      cal.ctx.fillText(timeString+stamp, (3/5)*cal.leftMargin, (16/15)*cal.topMargin + cal.hourHeight*i);
      //draw horizontal half hour lines
      cal.ctx.beginPath();
      cal.ctx.moveTo(cal.leftMargin, cal.topMargin + (cal.hourHeight / 2) + cal.hourHeight*i);
      cal.ctx.lineTo(cal.width, cal.topMargin + (cal.hourHeight / 2) + cal.hourHeight*i);
      cal.ctx.closePath();
      cal.ctx.lineWidth = 0.2;
      cal.ctx.stroke();
    }
    cal.firstBox = new cal.Box(new Date(2013, 2, 23, 8, 35), new Date(2013, 2, 23, 10, 35));
    cal.firstBox.draw();
  },

  Box: function(start, end) {
    this.start = start;
    this.startHour = start.getHours;
    this.startMinutes = start.getMinutes;
    this.startMinInt = this.startMinutes / 15;
    this.end = end;
    this.endHour = end.getHours;
    this.endMinutes = end.getMinutes;
    this.endMinInt = this.endMinutes / 15;
    this.draw = function() {
      console.log("here");
      var x = 1;
      var y = cal.topMargin + this.startHour*cal.hourHeight + this.startMinInt*cal.fiftHeight;
      var y1 = cal.topMargin + this.endHour*cal.hourHeight + this.endMinInt*cal.fiftHeight;
      var height = y1 - y;
      var radius = 5;
      var width = cal.dayWidth;
      roundedRect(cal.ctx, x, y, width, height, radius)
    }
  }

  // Box.prototype.draw: function() {
    
  // }
  

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
    var hourOptions = [1,2,3,4,5,6,7,8,9,10,11,12];
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
    var minuteOptions = ["00","15","30","45"];
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
    buttons.append('<input class="oneTime" type="radio" id="recurYes" name="recur" value="yes" />Yes');
    buttons.append('<input class="oneTime" type="radio" id="recurNo" name="recur" value="no" />No');
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
    buttons.append('<input class="daysOfTheWeek" type="checkbox" value="sunday" />Sun');
    buttons.append('<input class="daysOfTheWeek" type="checkbox" value="monday" />M');
    buttons.append('<input class="daysOfTheWeek" type="checkbox" value="tuesday" />T');
    buttons.append('<input class="daysOfTheWeek" type="checkbox" value="wednesday" />W');
    buttons.append('<input class="daysOfTheWeek" type="checkbox" value="thursday" />Th');
    buttons.append('<input class="daysOfTheWeek" type="checkbox" value="friday" />F');
    satButton.append('<input class="daysOfTheWeek" type="checkbox" value="saturday" />Sat');
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
    calendar.append('<input id="chooseDate" type="date" name="dayOfEvent" />');
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

  getOptionVal: function(obj, id) {
    var val;
    for (var i = 0; i < obj[0].length; i++) {
      if (obj[0][i].selected === true) {
        val = $("select#" + id + " option:eq(" + i + ")").text();
      }
    }
    console.log("val = ", val);
    return val;
  },

  addEvent: function() {
    var myTypeOptions = $("#chooseEventType");
    for (var i = 0; i < myTypeOptions[0].length; i++) {
      if (myTypeOptions[0][i].selected === true) {
        var name = $("select#chooseEventType option:eq(" + i + ")").text();
      }
    }
    var newEvent = {};
    newEvent["type"] = name;
    var myClassNameSelector = $("#chooseClass");
    for (var i = 0; i < myClassNameSelector[0].length; i++) {
      if (myClassNameSelector[0][i].selected === true) {
        var myClassNameString = $("select#chooseClass option:eq(" + i + ")").text();
      }
    }
    console.log( "myClassNameString = ", myClassNameString);
    var classIndex = -1;
    for (i = 0; i < database[userString].classes.length; i++) {
      if (database[userString].classes[i].name === myClassNameString) classIndex = i;
    }
    if (name === "Activity" || name === "Office Hours") {
      var myEventName = $("#newEventName").val();
      newEvent["name"] = myEventName;
      var priorityButtons = $(".priorityRadio");
      var myPriority;
      priorityButtons.each(function(i, item) {
        if (item.checked === true) {
          myPriority = item.value;
        }
      })
      newEvent["priority"] = myPriority;
      //get start time
      var myStartHour = Number(addEvent.getOptionVal($("#startHour"), "startHour"));
      var myStartMin = Number(addEvent.getOptionVal($("#startMinute"), "startMinute"));
      var myStartampm = addEvent.getOptionVal($("#startAMPM"), "startAMPM");
      if (myStartampm === "PM") {
        myStartHour += 12;
        if (myStartHour === 24) myStartHour -= 12;
      } if (myStartampm === "AM" && myStartHour === 12) myStartHour = 0;
      //get end time
      var myEndHour = Number(addEvent.getOptionVal($("#endHour"), "endHour"));
      var myEndMin = Number(addEvent.getOptionVal($("#endMinute"), "endMinute"));
      var myEndampm = addEvent.getOptionVal($("#endAMPM"), "endAMPM");
      if (myEndampm === "PM") {
        myEndHour += 12;
        if (myEndHour === 24) myEndHour -= 12;
      } if (myEndampm === "AM" && myEndHour === 12) myEndHour = 0;
    
      var oneTimeOrNot = $(".oneTime");
      var myOneTime;
      oneTimeOrNot.each(function(i, item) {
        if (item.checked === true) {
          myOneTime = item.value;
        }
      })
      if (myOneTime === "yes") {
        var dateString = $("#chooseDate").val();
        var myYear = Number(dateString.slice(0,4));
        var myMonth = Number(dateString.slice(5,7)) - 1;
        var myDay = Number(dateString.slice(8,10));
        newEvent["times"] = [[new Date(myYear, myMonth, myDay, myStartHour, myStartMin),
                              new Date(myYear, myMonth, myDay, myEndHour, myEndMin)]];
        newEvent["recurringTimes"] = [];
        console.log("myYear, myMonth, myDay, myStartHour, myStartMin = ", myYear, myMonth, myDay, myStartHour, myStartMin);
        console.log("newEvent['times'] = ", newEvent["times"]);
        addEvent.addEventToServer(userString, myClassNameString, name, newEvent);
        database[userString].classes[classIndex].events[name].push(newEvent);
      } else if (myOneTime === "no") {
        var days = [];
        var dayInputs = $(".daysOfTheWeek");
        dayInputs.each(function(i, item) {
          if (item.checked) days.push(item.value);
        });
        var thisDate = new Date();
        newEvent["recurringTimes"] = [[new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myStartHour, myStartMin),
                                       new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myEndHour, myEndMin),
                                       days]];
        newEvent["times"] = [];
        console.log("days = ", days);
        addEvent.addEventToServer(userString, myClassNameString, name, newEvent);
        console.log(classIndex);
        database[userString].classes[classIndex].events[name].push(newEvent);
      } else console.log("this should not happen");
    }



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
    //addEvent.addEventToServer(userString, myClassNameString, newEvent);

    //var classIndex = database[userString].classes.indexOf(myClassNameString);
    //database[userString].classes[classIndex].events.push(newEvent);
  },

  addEventToServer: function (user, thisClass, type, event) {
    $.ajax({
      type: "post",
      data: {"user": user, "class": thisClass, "type": type, "event": event},
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
                    "events": {"Activity": [], "Office Hours": [], "Homework": [], "Exam": [], "Quiz": [], "Lecture": []}};
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


// from: https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Drawing_shapes
function roundedRect(ctx,x,y,width,height,radius){
    ctx.beginPath();
    ctx.moveTo(x,y+radius);
    ctx.lineTo(x,y+height-radius);
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
    ctx.lineTo(x+width-radius,y+height);
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    ctx.lineTo(x+width,y+radius);
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
    ctx.lineTo(x+radius,y);
    ctx.quadraticCurveTo(x,y,x,y+radius);
    ctx.fill();
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
