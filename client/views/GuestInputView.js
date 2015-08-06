var GuestInputView = Backbone.View.extend({
// the collection will be set to Guests when GuestInputView is instantiated by the AppView
  // set element to the guestInput element in the dom
	el: '#guestInput',

  initialize: function(){
		this.render();
	},
	render: function(){
    // the html that comprises the form
    // set the element to a var that you can pass to the model constructor
      // this.$el = $guestName;  // convention to prefix var with $ to remember it's a jq obj
	},
	events: {
    // click event triggers a general purpose fcn that figures out which function to call on collection
    'click': 'doAction'
	},
  doAction: function(){
    // if click id is addGuest
      // call addGuest method on collection
    // else if click id is plusOne
      // call plusOne method on collection
    // else if click id is done
      // call done method on collection
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
