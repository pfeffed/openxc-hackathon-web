var Subscription = require('../models/subscription');

var routes = function(app) {
  var twilio = require('twilio')("AC078c39b936b7586257be47ba93ad83d6", "f3d433ae6b951c4134d410baf4b89a78");

  app.post('/api/hooks', function(req, res) {
    console.log("API Hooks:");
    console.log(req.body);

    var data = req.body;
    var sub = new Subscription({
      event: data.event,
      vid: data.trigger_data.vid,
      targetUrl: data.target_url
    });

    sub.save(function(err) {
      if (err) {
        res.json(400, err);
      } else {
        var msg = "sub "+data.event+" "+data.trigger_data.vehicle_speed;
        console.log(msg);
        twilio.sms.messages.create({
          body: msg,
          to: data.trigger_data.vid,
          from: "+14154244347"
        }, function(err, message) {
          console.log(message.sid);
          res.json(201);
        });
      }
    });

  });

  /**
   * body should include
   * timestamp, speed, id
   */
  app.post('/trigger/vehicle-speed-gt', function(req, res){
    console.log("Vehicle speed greater than: "+res.body);
    res.json(200);
  });

  app.post('/trigger/vehicle-speed-lt', function(req, res){
    console.log("Vehicle speed less than: "+res.body);
    res.json(200);
  });

  app.post('/trigger/ignition-on-idle', function(req, res){

  });
};

module.exports = routes;