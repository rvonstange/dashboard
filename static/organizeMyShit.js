
//global datastore
var database;

function addClass() {
	
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






function refreshDOM() {}

























$(document).ready(function() {
    get();
  });