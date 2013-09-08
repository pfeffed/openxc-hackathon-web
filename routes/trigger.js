var Subscription = require('../models/subscription'),
    request = require('superagent'),
    _ = require("underscore");

var routes = function(app) {
  var twilio = require('twilio')("AC078c39b936b7586257be47ba93ad83d6", "f3d433ae6b951c4134d410baf4b89a78");

  var createMessage = function(data) {
    var event = data.event;
    if (event == "vsgt" || event == "vslt") {
      return "sub "+data.event+" "+data.trigger_data.vehicle_speed;
    } else if (event == "flgt" || event == "fllt") {
      return "sub "+event+" "+data.trigger_data.fuel_level;
    } else if (event == "igst") {
      return "sub "+event+" "+data.trigger_data.time_limit;
    } else if (event == "gefo" || event == "gefi") {
      return "sub "+event+" "+data.trigger_data.lat+" "+data.trigger_data.lon+" "+data.trigger_data.radius;
    } else {
      return "sub " + event;
    }
  }

  var sendSMS = function(phoneNumber, msg, cb){
    twilio.sms.messages.create({
      body: msg,
      to: phoneNumber,
      from: "+14154244347"
    }, function(err, message) {
      console.log(message.sid);
      cb(err, message);
    });
  };

  app.post('/api/hooks', function(req, res) {
    console.log("API Hooks:");
    console.log(req.body);

    var data = req.body;

    Subscription.findOneAndUpdate({
      event: data.event,
      vid: data.trigger_data.vid
    },{
      event: data.event,
      vid: data.trigger_data.vid,
      targetUrl: data.target_url,
      triggerData: data.trigger_data
    }, {
      upsert: true
    },function(err, subscription){
      console.log(subscription);
      if (err) {
        res.json(400, err);
      } else {
        var msg = createMessage(data);
        console.log(msg);
        sendSMS(data.trigger_data.vid, msg, function(err, message) {
          console.log(message.sid);
          res.json(201, {"id":subscription._id});
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

  app.get('/resubscribe', function(req, res){
    Subscription.find({}, function(err, subs){
      _.each(subs, function(element, index, list){

      });

      res.json(200, {"message":"ok"});
    });

  });
};

module.exports = routes;