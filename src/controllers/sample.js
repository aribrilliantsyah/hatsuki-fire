var Sample = require('../models/sample');

// Sample
exports.sample = function(req, res) {
    res.send('NOT IMPLEMENTED: Sample');
};

// Sample With Param
exports.sample_with_params = function(req, res) {
    res.send('NOT IMPLEMENTED: Sample Params: ' + req.params.id);
};
