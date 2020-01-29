var fcm = require('./main_fcm');
const config = require('./../config.json');
const LUPIRKA_JSON = config.fcm.LUPIRKA_JSON;
// Sample
exports.get_token = function(req, res) {
  fcm.getAccessToken().then((data) => {
    console.log(data)
    res.send({
      'firebase_authorization' : data
    });
  }).catch((err) => {
    console.log(err)
    res.send('Terjadi Kesalahan').status(400);
  })
};

exports.get_token_lupirka = function(req, res) {
  fcm.getAccessToken(LUPIRKA_JSON).then((token) => {
    console.log(token)
    res.send({
      'firebase_authorization' : token
    });
  }).catch((err) => {
    console.log(err)
    res.send('Terjadi Kesalahan').status(400);
  })
};

