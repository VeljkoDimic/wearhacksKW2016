{
  "intents": [
    {
      "intent": "GetDirectionsByNameIntent",
      "slots": [
        {
          "name": "LocationByName",
          "type": "LOCATION_BY_NAME"
        }
      ]
    },
    {
      "intent": "GetDistanceByNameIntent",
      "slots": [
        {
          "name": "LocationByName",
          "type": "LOCATION_BY_NAME"
        }
      ]
    },
    {
      "intent": "SendTextIntent",
      "slots": [
        {
          "name": "TextMessage",
          "type": "TEXT_MESSAGE"
        },
        {
          "name": "Name",
          "type": "NAME_LIST"
        }
      ]
    },
    {
      "intent": "GetSpeedLimitIntent",
    },
    {
      "intent": "SendLocationIntent",
      "slots": [
        {
          "name": "Name",
          "type": "NAME_LIST"
        }
      ]
    },
    {
      "intent": "GetCurrentSpeedIntent",
    },
    {
      "intent": "GetCurrentLocationIntent",
    },
    {
      "intent": "GetHelpIntent",
    },
    {
      "intent": "AMAZON.StartOverIntent"
    },
    {
      "intent": "AMAZON.RepeatIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
}