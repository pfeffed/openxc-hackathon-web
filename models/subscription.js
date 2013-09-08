var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Subscription = new Schema({
    event: { type: String },
    vid: { type: String },
    createdAt: { type: Date, default: Date.now },
    targetUrl: { type: String }
});

module.exports = mongoose.model('Subscription', Subscription);