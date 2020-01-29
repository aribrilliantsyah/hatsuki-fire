const https = require('https');
const fs = require('fs');
const {google} = require('googleapis');
const config = require('./../config.json');
const PROJECT_ID = config.fcm.project_id;
var SERVICE_JSON = config.fcm.service_json;
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/'+ PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];
var app = [];
/**
 * Get a valid access token.
 */
// [START retrieve_access_token]
app.getAccessToken = (config_json) => {
  SERVICE_JSON = config_json ? config_json : SERVICE_JSON;
  return new Promise(function(resolve, reject) {
    var key = require('./../json/'+SERVICE_JSON);
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
// [END retrieve_access_token]

/**
 * Send HTTP request to FCM with given message.
 *
 * @param {JSON} fcmMessage will make up the body of the request.
 */
app.sendFcmMessage = (fcmMessage) => {
  getAccessToken().then(function(accessToken) {
    var options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      // [START use_access_token]
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
      // [END use_access_token]
    };

    var request = https.request(options, function(resp) {
      resp.setEncoding('utf8');
      resp.on('data', function(data) {
        console.log('Message sent to Firebase for delivery, response:');
        console.log(data);
      });
    });

    request.on('error', function(err) {
      console.log('Unable to send message to Firebase');
      console.log(err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  });
}

/**
 * Construct a JSON object that will be used to customize
 * the messages sent to iOS and Android devices.
 */
app.buildOverrideMessage = () => {
  var fcmMessage = buildCommonMessage();
  var apnsOverride = {
    'payload': {
      'aps': {
        'badge': 1
      }
    },
    'headers': {
      'apns-priority': '10'
    }
  };

  var androidOverride = {
    'notification': {
      'click_action': 'android.intent.action.MAIN'
    }
  };

  fcmMessage['message']['android'] = androidOverride;
  fcmMessage['message']['apns'] = apnsOverride;

  return fcmMessage;
}

/**
 * Construct a JSON object that will be used to define the
 * common parts of a notification message that will be sent
 * to any app instance subscribed to the news topic.
 */
app.buildCommonMessage = () => {
  return {
    'message': {
      'topic': 'news',
      'notification': {
        'title': 'FCM Notification',
        'body': 'Notification from FCM'
      }
    }
  };
}

// var message = process.argv[2];
// if (message && message == 'common-message') {
//   var commonMessage = buildCommonMessage();
//   console.log('FCM request body for message using common notification object:');
//   console.log(JSON.stringify(commonMessage, null, 2));
//   sendFcmMessage(buildCommonMessage());
// } else if (message && message == 'override-message') {
//   var overrideMessage = buildOverrideMessage();
//   console.log('FCM request body for override message:');
//   console.log(JSON.stringify(overrideMessage, null, 2));
//   sendFcmMessage(buildOverrideMessage());
// } else {
//   console.log('Invalid command. Please use one of the following:\n'
//       + 'node index.js common-message\n'
//       + 'node index.js override-message');
// }

module.exports = app;