angular.module('starter.controllers', ['ngCordova', 'firebase'])

.controller('AppCtrl', function($scope, $cordovaGeolocation, $firebaseObject) {
  var ref = new Firebase("https://jarvis-two.firebaseio.com/currentLocation");
  var currentLocationRef = $firebaseObject(ref);
  $scope.currentLocation = {};

  currentLocationRef.$bindTo($scope, 'currentLocation');

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  var locationService = setInterval(function(){
    navigator.geolocation.getCurrentPosition(function(response){
      $scope.currentLocation.lat = response.coords.latitude;
      $scope.currentLocation.long = response.coords.longitude;
    }, function(err){
    }, options)
  }, 5000);
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('addressController', function($scope, $ionicPopup, $firebaseObject) {
  var ref = new Firebase("https://jarvis-two.firebaseio.com/addresses");
  var addressesRef = $firebaseObject(ref);
  $scope.addresses = {};

  addressesRef.$bindTo($scope, 'addresses');

  $scope.deleteAddress = function(name){
    var myPopup = $ionicPopup.show({
      title: name,
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Delete</b>',
          type: 'button-assertive',
          onTap: function(e) {
            delete $scope.addresses[name];
            myPopup.close();
          }
        }
      ]
    });
  }

  $scope.addAddress = function() {
    $scope.newAddressName = "";
    $scope.newAddressAddress = "";

    var myPopup = $ionicPopup.show({
      template: '<label>Keyword</label><input type="text" placeholder="Keyword" ng-model="$parent.newAddressName"><br><label>Address</label><input type="text" placeholder="Address" ng-model="$parent.newAddressAddress">',
      title: 'Add new address',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newAddressName || !$scope.newAddressAddress) {
              e.preventDefault();
            } else {
              $scope.addresses[$scope.newAddressName.toLowerCase()] = $scope.newAddressAddress.toLowerCase();
              myPopup.close();
            }
          }
        }
      ]
    });
  };
})

.controller('contactsController', function($scope, $ionicPopup, $firebaseObject) {
  var ref = new Firebase("https://jarvis-two.firebaseio.com/contacts");
  var contactsRef = $firebaseObject(ref);
  $scope.contacts = {};

  contactsRef.$bindTo($scope, 'contacts');

  $scope.deleteContact = function(name){
    var myPopup = $ionicPopup.show({
      title: name,
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Delete</b>',
          type: 'button-assertive',
          onTap: function(e) {
            delete $scope.contacts[name];
            myPopup.close();
          }
        }
      ]
    });
  }


  $scope.addContact = function() {
    $scope.newContactName = "";
    $scope.newContactPhone = "";

    var myPopup = $ionicPopup.show({
      template: '<label>Name</label><input type="text" placeholder="Name" ng-model="$parent.newContactName"><br><label>Phone</label><input type="number" placeholder="Phone" ng-model="$parent.newContactPhone">',
      title: 'Add new contact',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newContactPhone || !$scope.newContactName) {
              e.preventDefault();
            } else {
              $scope.contacts[$scope.newContactName.toLowerCase()] = $scope.newContactPhone.toLowerCase();
              myPopup.close();
            }
          }
        }
      ]
    });
  };
})