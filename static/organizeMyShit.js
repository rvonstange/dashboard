
//global datastore
var database;

function addClass() {
	var user = $("#user-input");
	var category = $("#category-input");
	var name = $("#name-input");
	addClassToServer(user.val(), category.val(), name.val());

	var newClass = {"category": category.val(),
                  "name": name.val(),
                  "events": {}};

    database.user.val().classes.push(newClass);
    user.val("");
    category.val("");
    name.val("");
    refreshDOM();
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