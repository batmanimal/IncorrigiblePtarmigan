angular.module('seatly.edit', [])
.factory('editFactory', function($http){

	var editMethods = {};

	editMethods.getTargetGuest = function(){
    return $http.get('/edit/' + guest.guestName)
      .then(function(res){
      	return res.data;
      });
	};

	editMethods.editFriendName = function(guest){
		return $http({
			method: 'PUT',
			url: '/edit/' + guest.guestName,
			data: guest
		});
	};

	return editMethods;
});