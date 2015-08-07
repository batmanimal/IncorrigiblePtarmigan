angular.module('seatly.edit', [])
.controller('editController', function($scope, editFactory){
	$scope.guest = {};
	$scope.guest.friendName = '';

	$scope.editGuestFriendName = function(){
		editFactory.editFriendName($scope.guest);
	};

});