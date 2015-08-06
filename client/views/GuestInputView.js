var GuestInputView = Backbone.View.extend({
// the collection will be set to Guests when GuestInputView is instantiated by the AppView
	el: '#guestInput',

  initialize: function(){
		this.render();
	},
	render: function(){
    // the html that comprises the form

	},
	events: {
    'click #nextGuest': 'addToGuestList',
    'click #plusOne': 'addPlusOne',
    'click #done': 'createChart' 
	}

});


// var FormView = Backbone.View.extend({

//   initialize: function(){
//     this.collection.on('sync', this.stopSpinner, this);
//   },

//   events: {
//     'submit #send': 'handleSubmit'
//   },

//   handleSubmit: function(e){
//     e.preventDefault();

//     this.startSpinner();

//     var $text = this.$('#message');
//     this.collection.create({
//       username: window.location.search.substr(10),
//       text: $text.val()
//     });
//     $text.val('');
//   }

// });
