/* create guests collection in backbone */

var Guests = Backbone.Collection.extend({
	model: Guest,
	addGuest: function(guestName){
		console.log("addGuest called from collection");
		// need to create a new model here, and pass in the guestName 
		this.create({ 'guestName': guestName });
	}
	// addFriend
	// createList	
});

// var GuestSchema = mongoose.Schema({
//   guestName: String,
//   friendId: Number,
//   diningTableId: Number,
//   constraints: Array
// });


var testCollection = new Guests([
  {
    "guestName": "Eric",
     "friendId": 1,
     "diningTableId": 1
  }]
);