
var routes = function(app) {
  app.post('/api/hooks', function(req, res) {
    console.log("API Hooks:");
    console.log(req.body);

    res.json(201);
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
};

module.exports = routes;