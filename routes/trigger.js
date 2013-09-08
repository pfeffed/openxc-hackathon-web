var Subscription = require('../models/subscription'),
    request = require('superagent');

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

    Subscription.update({
      event: data.event,
      vid: data.trigger_data.vid
    },{
      event: data.event,
      vid: data.trigger_data.vid,
      targetUrl: data.target_url
    }, {
      upsert: true
    },function(err){
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

  app.delete('/api/hooks/:id', function(req, res){
    console.log("DELETE "+req.params.id);
    res.json(200);
  });

  /**
   * body should include
   * timestamp, speed, id
   */
  app.post('/trigger/:event', function(req, res){
    var data = req.body;
    var event = req.params.event;

    console.log("original timestamp:");
    console.log(data.timestamp);
    var date = new Date(parseInt(data.timestamp));
    data.timestamp = date.toString();

    console.log("Vehicle speed greater than: ");
    console.log(data);
    console.log("event: "+event);

    Subscription
      .findOne({event: event, vid: data.vid})
      .exec()
      .then(function(subscription){
        console.log("***** TRIGGER *****");
        console.log(subscription);
        request
          .post(subscription.targetUrl)
          .send(req.body)
          .end(function(resp){
            console.log("zapier responded");
            res.json(200);
          });
      });
  });
};

module.exports = routes;