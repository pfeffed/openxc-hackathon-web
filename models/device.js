var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Device = new Schema({
    registrationId: { type: String, required: true }
});

module.exports = mongoose.model('Device', Device);