var Device = require('../models/device'),
    mapper = require('../lib/model-mapper');

module.exports = function(app) {

    app.param('deviceId', function(req, res, next, id) {
        Device.findById(id, function(err, device) {
            if (err) {
                return next(err);
            }
            
            if (!device) {
                return res.send(404);
            }

            res.locals.device = device;
            next();
        });
    });
    
    app.get('/devices', function(req, res) {
        Device.find({}, function(err, devices) {
            res.json(devices);
        });
    });

    app.post('/devices', function(req, res) { 
        var device = new Device(req.body);

        device.save(function(err) {
            if (err) {
                res.json(400, err);
            } else {
                res.send(204);
            }
        });
    });

    app.get('/devices/:deviceId', function(req, res) {
        res.json(res.locals.device);
    });

    app.put('/devices/:deviceId', function(req, res) {
        var device = res.locals.device;
        mapper.map(req.body).to(device);

        device.save(function(err) {
            if (err) {
                res.json(400, err);
            } else {
                res.send(204);
            }
        });
    });

    app.delete('/devices/:deviceId/delete', function(req, res) {
        Device.remove({ _id : req.params.deviceId }, function(err) {
            if (err) {
                res.json(400, err);
            } else {
                res.send(204);
            }
        });
    });
}
