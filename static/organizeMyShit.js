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
  var logout = $("#logoutBar");
  logout.click(function(){
    window.location.href = 'index.html';
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
      if (!(user.val() in database)) {console.log("invalid user first"); index.invalidUser = true;}
      else index.invalidPass = true;
      index.refreshLogin();
    }
  },

  refreshLogin: function() {
    var container = $("#loginFail");
    container.html("");
    if (index.invalidUser) {
      console.log("invalid user second");
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
    cal.eventColors = {"Activity": "rgba(255, 69, 0, .5)",
                       "Office Hours": "rgba(192, 192, 192, .5)",
                       "Homework": "rgba(0, 0, 0, .75)",
                       "Exam": "rgba(71, 255, 255, .5)",
                       "Quiz": "rgba(255, 0, 255, .5)",
                       "Lecture": "rgba(0, 255, 0, .5)"}
    cal.currentDate = new Date();
    cal.currentDate = new Date(cal.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    cal.drawGrid();
    cal.drawDates();
    cal.drawOneTimeEvents();
    cal.drawRecurringEvents("Activity");
    cal.drawRecurringEvents("Office Hours");
  },

  drawDates: function() {
    var currentDate = cal.currentDate
    var tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    var twoDays = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    var threeDays  = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    var fourDays  = new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000);
    var fiveDays  = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    var sixDays  = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    var dates = [currentDate.getDate(), tomorrow.getDate(), twoDays.getDate(), 
                threeDays.getDate(), fourDays.getDate(), fiveDays.getDate(), sixDays.getDate()];
    var months = [currentDate.getMonth(), tomorrow.getMonth(), twoDays.getMonth(), 
                threeDays.getMonth(), fourDays.getMonth(), fiveDays.getMonth(), sixDays.getMonth()];
    for (var i = 0; i < months.length; i++){
      if (months[i] === 0) months[i] = "Jan";
      else if (months[i] === 1) months[i] = "Feb";
      else if (months[i] === 2) months[i] = "March";
      else if (months[i] === 3) months[i] = "April";
      else if (months[i] === 4) months[i] = "May";
      else if (months[i] === 5) months[i] = "June";
      else if (months[i] === 6) months[i] = "July";
      else if (months[i] === 7) months[i] = "Aug";
      else if (months[i] === 8) months[i] = "Sep";
      else if (months[i] === 9) months[i] = "Oct";
      else if (months[i] === 10) months[i] = "Nov";
      else if (months[i] === 11) months[i] = "Dec";
    }
    var dateAndMonth = [months[0] + " " + dates[0], months[1] + " " + dates[1], months[2] + " " + dates[2],
    months[3] + " " + dates[3], months[4] + " " + dates[4], months[5] + " " + dates[5], months[6] + " " + dates[6]];
    dateAndMonth.forEach(function(element, i) {
      cal.ctx.font = "bold 20px Times";
      cal.ctx.textAlign = "center";
      cal.ctx.fillText(element, cal.leftMargin + (cal.dayWidth / 2) + cal.dayWidth*i, (2/5)*cal.topMargin);
    })
    var days = [currentDate.getDay(), tomorrow.getDay(), twoDays.getDay(), 
                threeDays.getDay(), fourDays.getDay(), fiveDays.getDay(), sixDays.getDay()];
    var dayString;
    days.forEach(function(element, i) {
      if (element === 0) dayString = "Sunday";
      else if (element === 1) dayString = "Monday";
      else if (element === 2) dayString = "Tuesday";
      else if (element === 3) dayString = "Wednesday";
      else if (element === 4) dayString = "Thursday";
      else if (element === 5) dayString = "Friday";
      else if (element === 6) dayString = "Saturday";
      cal.ctx.font = "15px Times";
      cal.ctx.textAlign = "center";
      cal.ctx.fillText(dayString, cal.leftMargin + (cal.dayWidth / 2) + cal.dayWidth*i, (4/5)*cal.topMargin);
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
    // cal.firstBox = new cal.Box(new Date(2013, 2, 26, 8, 30), new Date(2013, 2, 26, 10, 30));
    // cal.secondBox = new cal.Box(new Date(2013, 2, 27, 4, 30), new Date(2013, 2, 27, 10, 30));

    // cal.firstBox.draw();
    // cal.secondBox.draw();
    //cal.ctx.fillRect(0,0,100,100);
  },

  Box: function(start, end, class_org, eventType, priority, dayIndex) {
    this.start = start;
    this.startHour = start.getHours();
    this.startMinutes = start.getMinutes();
    this.startMinInt = this.startMinutes / 15;
    this.end = end;
    this.class_org = class_org;
    this.eventType = eventType;
    this.priority = priority;
    this.endHour = end.getHours();
    this.endMinutes = end.getMinutes();
    this.endMinInt = this.endMinutes / 15;
    if (dayIndex === undefined) this.dayOfWeek = start.getDay();
    else this.dayOfWeek = dayIndex;
    this.currentDay = (new Date()).getDay();
    this.drawVariable = (this.dayOfWeek - this.currentDay);
    this.textColor = "black";
    if (this.drawVariable < 0) this.drawVariable +=7;
    this.drawVariable = this.drawVariable %7;
    if (this.priority === "high") this.alpha = 1;
    if (this.priority === "medium") this.alpha = .35;
    if (this.priority === "low") this.alpha = 0;
    if (this.eventType === "Activity") this.colorOfBox = cal.eventColors["Activity"];
    if (this.eventType === "Office Hours") this.colorOfBox = cal.eventColors["Office Hours"];
    if (this.eventType === "Homework") {
      this.colorOfBox = cal.eventColors["Homework"];
      this.textColor = "white";
    }
    if (this.eventType === "Exam") this.colorOfBox = cal.eventColors["Exam"];
    if (this.eventType === "Quiz") this.colorOfBox = cal.eventColors["Quiz"];
    if (this.eventType === "Lecture") this.colorOfBox = cal.eventColors["Lecture"];

    //cal.ctx.addEventListener('mousedown', this.click, false);
    this.draw = function() {
      var x = cal.dayWidth*this.drawVariable +cal.leftMargin;
      var y = cal.topMargin + this.startHour*cal.hourHeight + this.startMinInt*cal.fiftHeight;
      var y1 = cal.topMargin + this.endHour*cal.hourHeight + this.endMinInt*cal.fiftHeight;
      var height = y1 - y;
      var radius = 10;
      var width = cal.dayWidth;
      roundedRect(cal.ctx, x, y, width, height, radius, this.colorOfBox, this.alpha);
      if (height > cal.fiftHeight){
      cal.ctx.font = "15px Arial Black";
      cal.ctx.fillStyle = this.textColor;
      cal.ctx.fillText(this.class_org, x+width/2, y+height/2 +5);
      }
      
    }
    this.click = function() {


    }
  },

  drawOneTimeEvents: function() {
    var currentDate = cal.currentDate;
    var calendarLimitDate = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    for (var i = 0; i < database[userString].classes.length; i++) {
      for (var j = 0; j < database[userString].classes[i].events["Activity"].length; j++) {
        if (database[userString].classes[i].events["Activity"][j]["recurringTimes"] === undefined) {   
          var class_org = database[userString].classes[i]["name"];
          var priority = database[userString].classes[i].events["Activity"][j]["priority"];
          var start = (new Date(String(database[userString].classes[i].events["Activity"][j]["times"][0])));
          var end = (new Date(String(database[userString].classes[i].events["Activity"][j]["times"][1])));
          cal.tempBox = new cal.Box(start, end, class_org, "Activity", priority);               
          if ((start >= currentDate) && (start <= calendarLimitDate)) {
            cal.tempBox.draw();
          }
        }
      }
      for (var j = 0; j < database[userString].classes[i].events["Office Hours"].length; j++) {
        if (database[userString].classes[i].events["Office Hours"][j]["recurringTimes"] === undefined) {   
          var class_org = database[userString].classes[i]["name"];
          var priority = database[userString].classes[i].events["Office Hours"][j]["priority"];
          var start = (new Date(String(database[userString].classes[i].events["Office Hours"][j]["times"][0])));
          var end = (new Date(String(database[userString].classes[i].events["Office Hours"][j]["times"][1])));
          cal.tempBox = new cal.Box(start, end, class_org, "Office Hours", priority);               
          if ((start >= currentDate) && (start <= calendarLimitDate)) {
            cal.tempBox.draw();
          }
        }
      }
      for (var j = 0; j < database[userString].classes[i].events["Exam"].length; j++) {
          var class_org = database[userString].classes[i]["name"];
          var priority = database[userString].classes[i].events["Exam"][j]["priority"];
          var start = (new Date(String(database[userString].classes[i].events["Exam"][j]["time"][0])));
          var end = (new Date(String(database[userString].classes[i].events["Exam"][j]["time"][1])));
          cal.tempBox = new cal.Box(start, end, class_org, "Exam", priority);               
          if ((start >= currentDate) && (start <= calendarLimitDate)) {
            cal.tempBox.draw();
          }
      }
      for (var j = 0; j < database[userString].classes[i].events["Quiz"].length; j++) {
          var class_org = database[userString].classes[i]["name"];
          var priority = database[userString].classes[i].events["Quiz"][j]["priority"];
          var start = (new Date(String(database[userString].classes[i].events["Quiz"][j]["time"][0])));
          var end = (new Date(String(database[userString].classes[i].events["Quiz"][j]["time"][1])));
          cal.tempBox = new cal.Box(start, end, class_org, "Quiz", priority);               
          if ((start >= currentDate) && (start <= calendarLimitDate)) {
            cal.tempBox.draw();
          }
      }
      for (var j = 0; j < database[userString].classes[i].events["Homework"].length; j++) {
          var class_org = database[userString].classes[i]["name"];
          var priority = database[userString].classes[i].events["Homework"][j]["priority"];
          var start = (new Date(String(database[userString].classes[i].events["Homework"][j]["due"])));
          var endBlock = new Date(start.getTime() + .5 * 60 * 60 * 1000);          
          cal.tempBox = new cal.Box(start, endBlock, class_org, "Homework", priority);               
          if ((start >= currentDate) && (start <= calendarLimitDate)) {
            cal.tempBox.draw();
          }
      }
  }
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
          $("#eventTable").find("tr:gt(6)").remove();
          if ($('#recurNo').val() === "no") addEvent.createDays();
        });
        $('#recurYes').change(function() {
          $("#eventTable").find("tr:gt(6)").remove();
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

      $('#chooseEventType').change(function() {
        addEvent.refreshLowerEventPage();
      });


    console.log("myOptions[0][0].selected = ", $("select#chooseEventType option:eq(0)").text());
  },
    hwDueTime: function() {
    var startHour = $("<select>");
    startHour.attr("id", "Hour");
    var hourOptions = [1,2,3,4,5,6,7,8,9,10,11,12];
    for (var i = 0; i < hourOptions.length; i++) {
        var newHourOption = $("<option>");
        newHourOption.html(hourOptions[i]);
        startHour.append(newHourOption);
    } 
    var startMinute = $("<select>");
    startMinute.attr("id", "Minute");
    var minuteOptions = ["00","15","30","45"];
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

  createTimeChoice: function(rec) {
    var startHour = $("<select>");
    var endHour = $("<select>");
    if (!rec) startHour.attr("id", "startHour");
    else startHour.attr("id", "startHourRec");
    if (!rec) endHour.attr("id", "endHour");
    else endHour.attr("id", "endHourRec");
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
    if (!rec) startMinute.attr("id", "startMinute");
    else startMinute.attr("id", "startMinuteRec");
    if (!rec) endMinute.attr("id", "endMinute");
    else endMinute.attr("id", "endMinuteRec");
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
    if (!rec) startAMPM.attr("id", "startAMPM");
    else startAMPM.attr("id", "startAMPMRec");
    if (!rec) endAMPM.attr("id", "endAMPM");
    else endAMPM.attr("id", "endAMPMRec");
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
    if (!rec) newRow.attr("id", "meetingTimes");
    else newRow.attr("id", "meetingTimesRec");
    var startMeeting = $("<td>");
    startMeeting.html("Start Time:");
    newRow.append(startMeeting);
    newRow.append(startHour);
    newRow.append(startMinute);
    newRow.append(startAMPM);
    var newRow2 = $("<tr>");
    var endMeeting = $("<td>");
    endMeeting.html("End Time:");
    newRow2.append(endMeeting);
    newRow2.append(endHour);
    newRow2.append(endMinute);
    newRow2.append(endAMPM);
    eventTable.append(newRow);
    eventTable.append(newRow2);
  },

  recurringEvent: function() {
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    var question = $("<td>");
    question.html("One Time Event?");
    var buttons = $("<td>");
    buttons.attr("class","buttons");
    buttons.append('<input class="oneTime" type="radio" id="recurYes" required name="recur" value="yes" />Yes');
    buttons.append('<input class="oneTime" type="radio" id="recurNo" required name="recur" value="no" />No');
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
    buttons.append('<input type="radio" id="recitationYes" required name="recitation" value="yes" />Yes');
    buttons.append('<input type="radio" id="recitationNo" required name="recitation" value="no" />No');
    newRow.append(question);
    newRow.append(buttons);
    eventTable.append(newRow);
  },

  createDays: function (rec) {
    var eventTable = $('#eventTable');
    var newRow = $("<tr>");
    var question = $("<td>");
    question.html("Choose Days: ");
    var buttons = $("<td>");
    var satButton = $("<td>");
    if (!rec) buttons.attr("class","buttons");
    else buttons.attr("class", "buttonsRec");
    if (!rec) {
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="sunday" />Sun');
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="monday" />M');
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="tuesday" />T');
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="wednesday" />W');
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="thursday" />Th');
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="friday" />F');
      buttons.append('<input class="daysOfTheWeek" type="checkbox" value="saturday" />Sat');
    } else {
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="sunday" />Sun');
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="monday" />M');
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="tuesday" />T');
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="wednesday" />W');
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="thursday" />Th');
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="friday" />F');
      buttons.append('<input class="daysOfTheWeekRec" type="checkbox" value="saturday" />Sat');
    }
    
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
    calendar.append('<input id="chooseDate" type="date" required name="dayOfEvent" />');
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
          $("#eventTable").find("tr:gt(6)").remove();
          if ($('#recurNo').val() === "no") console.log("recurNo has changed"); addEvent.createDays();
        });
        $('#recurYes').change(function() {

          $("#eventTable").find("tr:gt(6)").remove();
          if ($('#recurYes').val() === "yes") console.log("recurYes has changed"); addEvent.createCalendarChoice();
        });
    }
    else if (name === "Lecture") {
      addEvent.createTimeChoice();
      addEvent.createDays();
      addEvent.recitation();
      $('#recitationNo').change(function() {
          $("#eventTable").find("tr:gt(7)").remove();
          });
      $('#recitationYes').change(function() {
          $("#eventTable").find("tr:gt(7)").remove();
          if ($('#recitationYes').val() === "yes") {
            addEvent.createTimeChoice(true);
            addEvent.createDays(true);
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
    var timeSuccessful = true;
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
    var priorityButtons = $(".priorityRadio");
    var myPriority;
    priorityButtons.each(function(i, item) {
      if (item.checked === true) {
        myPriority = item.value;
      }
    })
      newEvent["priority"] = myPriority;
      var myEventName = $("#newEventName").val();
      newEvent["name"] = myEventName;
    if (name === "Activity" || name === "Office Hours") {
      
    
      var oneTimeOrNot = $(".oneTime");
      var myOneTime;
      oneTimeOrNot.each(function(i, item) {
        if (item.checked === true) {
          myOneTime = item.value;
        }
      })
      if (myOneTime === "yes") {
        var allTimes = addEvent.getStartAndEndTimes();
        if (allTimes === undefined) timeSuccessful = false;
        newEvent["times"] = allTimes;
        newEvent["recurringTimes"] = [];
      } else if (myOneTime === "no") {
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
        var days = [];
        var dayInputs = $(".daysOfTheWeek");
        dayInputs.each(function(i, item) {
          if (item.checked) days.push(item.value);
        });
        var thisDate = new Date();
        newEvent["recurringTimes"] = [new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myStartHour, myStartMin),
                                       new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myEndHour, myEndMin),
                                       days];
        newEvent["times"] = [];
        console.log("days = ", days);
        if (myStartHour > myEndHour) timeSuccessful = false;
        else if (myStartHour === myEndHour && myStartMin >= myEndMin) timeSuccessful = false;

      } else console.log("this should not happen");
    } else if (name === "Homework") {
      var dateString = $("#chooseDate").val();
      var myYear = Number(dateString.slice(0,4));
      var myMonth = Number(dateString.slice(5,7)) - 1;
      var myDay = Number(dateString.slice(8,10));
      var myHour = Number(addEvent.getOptionVal($("#Hour"), "Hour"));
      var myMin = Number(addEvent.getOptionVal($("#Minute"), "Minute"));
      var myampm = addEvent.getOptionVal($("#AMPM"), "AMPM");
      if (myampm === "PM") {
        myHour += 12;
        if (myHour === 24) myHour -= 12;
      } if (myampm === "AM" && myHour === 12) myHour = 0;
      newEvent["due"] = new Date(myYear, myMonth, myDay, myHour, myMin);
      
    } else if (name === "Exam" || name === "Quiz") {
      var allTimes = addEvent.getStartAndEndTimes();
      if (allTimes === undefined) timeSuccessful = false;
      newEvent["time"] = allTimes;
    } else if (name === "Lecture") {
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
      if (myStartHour > myEndHour) timeSuccessful = false;
      else if (myStartHour === myEndHour && myStartMin >= myEndMin) timeSuccessful = false;
      var days = [];
      var dayInputs = $(".daysOfTheWeek");
      dayInputs.each(function(i, item) {
        if (item.checked) days.push(item.value);
      });
      var thisDate = new Date();
      newEvent["lectureTimes"] = [new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myStartHour, myStartMin),
                                     new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myEndHour, myEndMin),
                                     days];
      if ($("#recitationYes")[0].checked === true) {
        var myStartHour = Number(addEvent.getOptionVal($("#startHourRec"), "startHourRec"));
        var myStartMin = Number(addEvent.getOptionVal($("#startMinuteRec"), "startMinuteRec"));
        var myStartampm = addEvent.getOptionVal($("#startAMPMRec"), "startAMPMRec");
        if (myStartampm === "PM") {
          myStartHour += 12;
          if (myStartHour === 24) myStartHour -= 12;
        } if (myStartampm === "AM" && myStartHour === 12) myStartHour = 0;
        //get end time
        var myEndHour = Number(addEvent.getOptionVal($("#endHourRec"), "endHourRec"));
        var myEndMin = Number(addEvent.getOptionVal($("#endMinuteRec"), "endMinuteRec"));
        var myEndampm = addEvent.getOptionVal($("#endAMPMRec"), "endAMPMRec");
        if (myEndampm === "PM") {
          myEndHour += 12;
          if (myEndHour === 24) myEndHour -= 12;
        } if (myEndampm === "AM" && myEndHour === 12) myEndHour = 0;
        var days = [];
        var dayInputs = $(".daysOfTheWeekRec");
        dayInputs.each(function(i, item) {
          if (item.checked) days.push(item.value);
        });
        if (myStartHour > myEndHour) timeSuccessful = false;
        else if (myStartHour === myEndHour && myStartMin >= myEndMin) timeSuccessful = false;
        var thisDate = new Date();
        newEvent["recitationTimes"] = [new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myStartHour, myStartMin),
                                       new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), myEndHour, myEndMin),
                                       days];
        }

    }
    console.log("timeSuccessful = ", timeSuccessful);
    if (timeSuccessful === false) {
      var thisContainer = $("#addEventAlert");
      thisContainer.html("Please pick appropriate times!")
      console.log(thisContainer.html());
      return;
    } else $("#addEventAlert").html("");

    addEvent.addEventToServer(userString, myClassNameString, name, newEvent);
    database[userString].classes[classIndex].events[name].push(newEvent);
    $("#eventAdded").html("Event added successfully!");
    $("#eventAdded").css("color", "rgb(255,127,80)");
  },

  getStartAndEndTimes: function() {
    var dateString = $("#chooseDate").val();
    var myYear = Number(dateString.slice(0,4));
    var myMonth = Number(dateString.slice(5,7)) - 1;
    var myDay = Number(dateString.slice(8,10));
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
    if (myStartHour > myEndHour) return undefined;
    else if (myStartHour === myEndHour && myStartMin >= myEndMin) return undefined;
    return [new Date(myYear, myMonth, myDay, myStartHour, myStartMin),
            new Date(myYear, myMonth, myDay, myEndHour, myEndMin)]
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
    var success;
    var current = "";
    var successful = {"Type": category !== undefined, "Name": className.val() !== undefined && 
    !addClass.nameInDatabase(className.val()) && className.val() !== ""};
    var addClassAlert = $("#addClassAlert");
    console.log("truth value", database[user].classes["Bhangra"]);
    for (key in successful) {
      if (successful[key] === false) {
        current += " " + key + ";";
        success = false;
      }
    }
    if (success === false) {
      addClassAlert.html("Invalid Input(s): " + current);
      return;
    } else addClassAlert.html("");
    console.log(user, category.value, className.val());
    addClass.addClassToServer(user, category.value, className.val());
    $("#addedClass").html("Added class successfully!");
    $("#addedClass").css("color", "rgb(255,127,80)");
    var newClass = {"category": category.value,
                    "name": className.val(),
                    "events": {"Activity": [], "Office Hours": [], "Homework": [], "Exam": [], "Quiz": [], "Lecture": []}};
    if (database[user].classes === undefined) database[user].classes = [];

    database[user].classes.push(newClass);
    className.val("");
    addClass.refreshAddClass();
  },

  nameInDatabase: function(name) {
    for (i = 0; i < database[userString].classes.length; i++) {
      if (database[userString].classes[i].name === name) return true;
    }
    return false;
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
