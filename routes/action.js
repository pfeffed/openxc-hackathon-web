
var routes = function(app) {
  var twilio = require('twilio')("AC078c39b936b7586257be47ba93ad83d6", "f3d433ae6b951c4134d410baf4b89a78");

  app.get('/action/:id/unlock', function(req, res) {
    twilio.sms.messages.create({
      body: "lock",
      to: req.params.id,
      from: "+14154244347"
    }, function(err, message) {
      console.log(message.sid);
      res.json(200, message.sid);
    });
  });

  app.get('/action/:id/lock', function(req, res) {
    twilio.sms.messages.create({
      body: "unlock",
      to: req.params.id,
      from: "+14154244347"
    }, function(err, message) {
      console.log(message.sid);
      res.json(200, message.sid);
    });
  });

  app.get('/action/:id/beep', function(req, res) {
    twilio.sms.messages.create({
      body: "beep",
      to: req.params.id,
      from: "+14154244347"
    }, function(err, message) {
      console.log(message.sid);
      res.json(200, message.sid);
    });
  });

};

module.exports = routes;