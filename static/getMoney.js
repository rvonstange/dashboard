
  // ------------
  // IMPLEMENT ME
  // ------------

  // Global datastore
  var listings;

  // Implement addListing()
  function addListing() {
    var desc = $("#desc-input");
    var author = $("#author-input");
    var price = $("#price-input");
    var date = new Date();
    add(desc.val(), author.val(), price.val(), date);

    var obj = {"desc": desc.val(),
              "author": author.val(),
              "date": date,
              "price": price.val(),
              "sold": false };
    listings.push(obj);
    desc.val("");
    author.val("");
    price.val("");
    refreshDOM();
  }
 
  // Implement refreshDOM()
  function refreshDOM() {
    if (listings === undefined) return;
    var container = $(".listings");
    container.html("");
    for (var i = 0; i < listings.length; i++) {
      var listing = listings[i];
      var li = $("<li>");
      var desc = $("<p>").html(listing.desc);
      var author = $("<h3>").html(listing.author);
      var price = $("<p>").html(listing.price);
      var date = $("<h6>").html(listing.date);
      var deleteButton = $("<button>").html("Delete");
      var soldButton = $("<button>").html("Sold!");
      // var element = $(this);
      // var id = element.attr("id");
      deleteButton.css("color", "#000000");
      deleteButton.css("background-color", "#FFFFFF");
      deleteButton.css("border-radius", "5px");
      deleteButton.css("border", "none");
      soldButton.css("color", "#000000");
      soldButton.css("background-color", "#FFFFFF");
      soldButton.css("border-radius", "5px");
      soldButton.css("border", "none");
      //deleteButton.attr("id", "submitButton");
      (function() {
        var j = i;

        soldButton.click(function() {
        //console.log("sold!");
        //li.addClass("sold");
        edit(j, undefined, undefined, undefined, true);
        listings[j].sold = true;
        //console.log(listings[j]);
        refreshDOM();
      })

      deleteButton.click(function() {
        //console.log("delete!");
        
        del(j);
        listings.splice(j, 1);
        refreshDOM();
      })
      })()

      //console.log(i, listing);

      

      if (listing.sold) {
        //console.log("it comes here");
        li.addClass("sold");
      }
      
      li.append(author);
      li.append(date);
      li.append(desc);
      li.append(price);
      li.append(deleteButton);
      li.append(soldButton);

      
      container.append(li);
    }

  }
  
  
  // Implement the get() function
  function get() {
    $.ajax({
      type: "get",
      url: "/listings",
      success: function(data) {
        listings = data.listings;
        //console.log(listings);
        refreshDOM();
      }
    });
  }

  // Implement the add(desc, author, price) function
  function add(desc, author, price, date) {
    $.ajax({
      type: "post",
      data: {"desc": desc, "author": author, "price": price, "date": date},
      url: "/listings",
      success: function(data) { 
        //listings = data.listings;
        //get();
        //listings.append(data);
        //console.log(listings);
        //refreshDOM();
      }
    });
  }

  function edit(id, desc, author, price, sold) {
    $.ajax({
      type: "put",
      data: {desc: desc, author: author, price: price, sold: sold},
      url: "/listings/" + id,
      success: function(data) { 
        //refreshDOM();
      }
    });
  }

  function del(id) {
    $.ajax({
      type: "delete",
      url: "/listings/" + id,
      success: function(data) { 
        //console.log(data);
        //refreshDOM();
      }
    });
  }

  function delAll() {
    $.ajax({
      type: "delete",
      url: "/listings",
      success: function(data) {
        //refreshDOM();
      }
    });
  }

  $(document).ready(function() {
    get();
  });