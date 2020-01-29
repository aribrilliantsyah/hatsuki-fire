// wiki.js - Wiki route module.
var express = require('express');
var router = express.Router();

//Controllers
var sample_controller = require('./controllers/sample');
var fcm_controller = require('./controllers/fcm');

// Request Sample
router.get('/sample', sample_controller.sample);
// Request Sample With Param
router.get('/sample/:id', sample_controller.sample_with_params);

router.get('/fcm/get_token', fcm_controller.get_token);
router.get('/fcm/get_token_lupirka', fcm_controller.get_token_lupirka);

module.exports = router;