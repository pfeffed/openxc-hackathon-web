var gcm = require('node-gcm');

var routes = function(app) {

  // Defines the root page. can be safely removed!
  app.get('/push', function(req, res) {
    var message = new gcm.Message({
      collapseKey: 'demo',
      delayWhileIdle: true,
      timeToLive: 3,
      data: {
        foo: 'bar',
        hello: 'world'
      }
    })
    var sender = new gcm.Sender('insert Google Server API Key here');
    var registrationIds = [];
    registrationIds.push('regId1');
    sender.send(message, registrationIds, 4, function (err, result) {
      console.log(result);
    });
  });
}

module.exports = routes;