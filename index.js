'use strict';

var storage = require('./src/storage');

exports.handler = function (event, context) {
  try {
    if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.2a3a6f64-842e-4f18-933c-3190c1b0f877") {
      context.fail("Invalid Application ID");
    }
    if (event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session);
    }
    if (event.request.type === "LaunchRequest") {
      onLaunch(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "SessionEndedRequest") {
      onSessionEnded(event.request, event.session);
      context.succeed();
    }
  } catch (e) {
    context.fail("Exception: " + e);
  }
};

//Called when the session starts.
function onSessionStarted(sessionStartedRequest, session) {
}

//Called when the user invokes the skill without specifying what they want.
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback);
}

//Called when the user specifies an intent for this skill.
function onIntent(intentRequest, session, callback) {
  var intent = intentRequest.intent,
  intentName = intentRequest.intent.name;

  if ("GetDirectionsByNameIntent" === intentName) {
    getDirectionsByName(intent, session, callback);
  } else if ("GetDistanceByNameIntent" === intentName) {
    getDistanceByName(intent, session, callback);
  } else if ("GetSpeedLimitIntent" === intentName) {
    getSpeedLimit(intent, session, callback);
  } else if ("SendTextIntent" === intentName) {
    sendText(intent, session, callback);
  } else if ("SendLocationIntent" === intentName) {
    sendLocation(intent, session, callback);
  } else if ("GetCurrentSpeedIntent" === intentName) {
    getCurrentSpeed(intent, session, callback);
  } else if ("GetCurrentLocationIntent" === intentName) {
    getCurrentLocation(intent, session, callback);
  } else if ("GetHelpIntent" === intentName) {
    getHelp(intent, session, callback);
  } else if ("GetNextStepIntent" === intentName) {
    getNextStep(intent, session, callback);
  } else if ("AMAZON.StartOverIntent" === intentName) {
    getWelcomeResponse(callback);
  } else if ("AMAZON.RepeatIntent" === intentName) {
    handleRepeatRequest(intent, session, callback);
  } else if ("AMAZON.StopIntent" === intentName) {
    handleFinishSessionRequest(intent, session, callback);
  } else if ("AMAZON.CancelIntent" === intentName) {
    handleFinishSessionRequest(intent, session, callback);
  } else {
    throw "Invalid intent";
  }
}


/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
 function onSessionEnded(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
    + ", sessionId=" + session.sessionId);
}

// ------- Skill specific business logic -------

function getWelcomeResponse(callback) {
  var sessionAttributes = {},
  speechOutput = "Hello",
  repromptText = "Tell me something";

  sessionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": repromptText
  };
  callback(sessionAttributes,
    buildSpeechletResponse(speechOutput, repromptText, false));
}

function getDirectionsByName(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotName = intent.slots.LocationByName.value;

  console.log("Get direction to: " + slotName);
  storage.getDirectionsByName(slotName, function(data){
    console.log('success get directions:');
    console.log(data);

    if(!data){
      speechOutput = "I can't find " + slotName;
      repromptText = "Try again?"
    } else {
      // speechOutput = "Starting navigation to " + slotName + ". " + data;
      speechOutput = data;
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function getNextStep(intent, session, callback){
  var speechOutput;
  var repromptText;
  // var slotName = intent.slots.Name.value;

  storage.getNextStep(function(data){
    console.log('success get next step:');
    console.log(data);

    if(!data){
      speechOutput = "I can't find next step";
      repromptText = "Try again?"
    } else {
      speechOutput = data;
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}


function getHelp(intent, session, callback){
  var speechOutput;
  var repromptText;

  storage.getHelp(function(data){
    console.log('success send help');
    console.log(data);

    if(!data){
      speechOutput = "I wasn't able to send for help. Please try again";
      repromptText = "Try again?"
    } else {
      speechOutput = "I sent your location to your contacts";
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function getCurrentLocation(intent, session, callback){
  var speechOutput;
  var repromptText;

  storage.getCurrentLocation(function(data){
    console.log('success get');
    console.log(data);

    if(!data){
      speechOutput = "I don't know where you are";
      repromptText = "Try again?"
    } else {
      speechOutput = "Your current location is " + data;
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function getDistanceByName(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotName = intent.slots.LocationByName.value;

  storage.getDistanceByName(slotName, function(data){
    console.log('success get');
    console.log(data);

    if(!data){
      speechOutput = "I don't know how far " + slotName + " is";
      repromptText = "Try again?"
    } else {
      speechOutput = slotName + " is " + data.distance + " from your current location. It will take you " + data.duration + " to get there";
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function sendLocation(intent, session, callback){
  var speechOutput;
  var repromptText;

  var slotName = intent.slots.Name.value;

  storage.sendLocation(slotName, function(data){
    console.log('success send text');
    console.log(data);
    
    speechOutput = "Sent location to " + slotName;

    var sessionAttributes = {
      "speechOutput": speechOutput
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}


function sendText(intent, session, callback){
  var speechOutput;
  var repromptText;

  var slotName = intent.slots.Name.value;
  var slotMessage = intent.slots.TextMessage.value;

  var dataObject = {
    name: slotName,
    message: slotMessage
  };

  storage.sendText(dataObject, function(data){
    console.log('success send text');
    console.log(data);

    speechOutput = "Sent text to " + slotName;

    var sessionAttributes = {
      "speechOutput": speechOutput
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function handleRepeatRequest(intent, session, callback) {
  var speechOutput = session.speechOutput;
  var repromptText = "Continue?"

  callback(null, 
    buildSpeechletResponse(speechOutput, repromptText, false));
}

function handleFinishSessionRequest(intent, session, callback) {
  callback(null,
    buildSpeechletResponse("Good bye!", "", true));
}

// ------- Helper functions to build responses -------
function buildSpeechletResponse(output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: "PlainText",
      text: output
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  };
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}