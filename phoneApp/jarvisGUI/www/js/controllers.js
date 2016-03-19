angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $cordovaGeolocation) {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  var locationService = setInterval(function(){
    navigator.geolocation.getCurrentPosition(function(response){
      var lat = response.coords.latitude;
      var long = response.coords.longitude;
      // alert(lat.toString() + " " + long.toString());
    }, function(err){
      // alert('error: ' + JSON.stringify(err));
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

.controller('contactsController', function($scope, $ionicPopup) {
  alert("contacts");
  $scope.newContact = {
    name: "",
    phone: "",
  },

  $scope.contacts = [
    {
      name: "Bill",
      phone: "4163323710"
    },
    {
      name: "Bill's cell",
      phone: "6475232602"
    }
  ]

  $scope.deleteContact = function(index){
    alert(index);
    var myPopup = $ionicPopup.show({
      title: $scope.contacts[index].name,
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Delete</b>',
          type: 'button-assertive',
          onTap: function(e) {
            $scope.splice(index, 1);
          }
        }
      ]
    });
  }


  $scope.addContact = function() {
    var myPopup = $ionicPopup.show({
      template: '<label>Name</label><input type="text" ng-model="newContact.name"><br><label>Phone</label><input type="text" ng-model="newContact.phone">',
      title: 'Add new contact',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if ((!$scope.newContact.name || !$scope.newContact.phone) && verifyNewPerson()) {
              alert('invalid');
              e.preventDefault();
            } else {
              $scope.contacts.push($scope.newContact);
              $scope.newContact = {
                name: "",
                phone: ""
              }
            }
          }
        }
      ]
    });
  };

  var verifyNewPerson = function(){
    for(var x = 0; x < $scope.contacts.length; x++) {
      if($scope.contacts[x].toLowerCase() == $scope.newContact.toLowerCase()){
        return false;
      }
    }
    return true;
  }
})