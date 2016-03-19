'use strict';
//var AWS = require("aws-sdk");

var Firebase = require("firebase");
var contactRef = new Firebase("https://jarvis-two.firebaseio.com/contacts");
var originRef = new Firebase("https://jarvis-two.firebaseio.com/currentLocation");
var destinationRef = new Firebase("https://jarvis-two.firebaseio.com/addresses");
var authentication = require("./auth");

var google = require('google-distance-matrix');

var accountSid = authentication.accountSid();
var authToken = authentication.authToken();
var googleKey = authentication.googleKey();

var client = require('twilio')(accountSid, authToken);

var https = require("https");
var mapsResponseObject = {};
//https://www.google.ca/maps/search/43.486266,-80.5549554
function dist (origin, destination, key, callback){
    var options = {
        host: 'www.google.ca',
        path: '/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&key=' + key,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = https.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {

            mapsResponseObject = JSON.parse(output);
            console.log(mapsResponseObject.routes[0].legs[0].distance.text);
            console.log(mapsResponseObject.routes[0].legs[0].duration.text);
            

            callback({
                'distance': mapsResponseObject.routes[0].legs[0].distance.text,
                'duration': mapsResponseObject.routes[0].legs[0].duration.text
            });

        });
    });
    req.end();

    req.on('error', function(err) {
        console.log("error: " + err)
    });
}


var MYNUMBER = "+12262711162";

var HELP_MESSAGE = "This is a test message; don't call 911";

function getNumber(name, callback){
    contactRef.orderByKey().equalTo(name).on("value", function(snapshot){
        //console.log(snapshot.val()[name]);
        callback(snapshot.val()[name]);
    });
}



var storage = (function () {

    return {
        sendText: function (dataObject, callback) {
            getNumber(dataObject.name, function(number){
                client.messages.create({ 
                    to: "+1" + number, 
                    from: MYNUMBER, 
                    body: dataObject.message
                }, function(err, message) { 
                    console.log("error"); 
                });

            })
        },
        getDirectionsByName: function (dataObject, callback) {

        },
        getDistanceByName: function (dataObject, callback) {
            var myOrigin = {};
            var myDestination = {};

            originRef.on("value", function(snapshot){
                console.log(snapshot.val());
                myOrigin = snapshot.val();

                destinationRef.on("value", function (snapshot){
                    myDestination = snapshot.val();

                    console.log(myOrigin);
                    console.log(myDestination);
                });
            })
            // originRef.orderByKey().equalTo("lat").on("value", function(snapshot){
            //     myOrigin['lat'] = snapshot.val(); 
            // });
            // originRef.orderByKey().equalTo("lng").on("value", function(snapshot){
            //     myOrigin['lng'] = snapshot.val();
            // });



            // var myDestination;


            
            // // console.log(myOrigin.lat + ',' + myOrigin.lng);
            // dist(snap)

            // dist('43.2764431,-80.5481636', '43.4774431,-80.5481636', googleKey, function(data){
            //     callback(data);
            // });
        },
        getSpeedLimit: function (dataObject, callback) {
            //Speed limits This service returns the posted speed limit for a road 
            //segment. The Speed Limit service is only available to Google Maps APIs 
            //Premium Plan customers. 
        },
        sendLocation: function (name, callback) {

        },
        getCurrentSpeed: function (callback) {

        },
        getCurrentLocation: function (callback) {
            
            originRef.on("value", function (snapshot){
                var retval = {};
                snapshot.forEach(function(childSnapshot){
                    //location[childSnapshot.key()] = childSnapshot.val();
                    retval[childSnapshot.key()] = childSnapshot.val();
                })
                console.log(retval);
                callback(retval);
            });
            

            
        },
        getHelp: function (callback) {
            contactRef.orderByKey().on("value", function (snapshot){
                snapshot.forEach(function (childSnapshot){
                    sendText({'name': childSnapshot.key(), 'message': HELP_MESSAGE});
                })
            });
        }


    };
})();


storage.getDistanceByName('asdf', function (data){
    console.log(data);
});

module.exports = storage;