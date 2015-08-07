/* create guest model in backbone */
var Guest = Backbone.Model.extend({
	defaults: {
		// user input will be friendName, server looksup friendId from the db
		guestName: 'J Doe',
		friendName: '',
		diningTableId: null,
		constraints: []
	},
	initialize: function(){

	}
});

// var GuestSchema = mongoose.Schema({
//   guestName: String,
//   friendId: Number,
//   diningTableId: Number,
//   constraints: Array
// });