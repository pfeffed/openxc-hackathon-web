var path = require('path'),
    express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    config = require('./config'),
    MongoStore = require('connect-mongo')(express);


var mongooseConnection = mongoose.connect(config.db.url, function(err) {
    if (err) {
        console.log('Could not connect to database', config.db.url, ' due to error', err);
        process.exit(1);
    }
});

var app = express();

// Express settings
app.disable('x-powered-by');

// Configuration
app.set('port', process.env.PORT || config.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.cookieParser(config.secret));

// Session
app.use(express.session({
    secret: config.sessionSecret,
    store: new MongoStore({
        collection: "sessions",
        mongoose_connection: mongooseConnection.connections[0]
    }),
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));

app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

require('./helpers')(app);
require('./routes')(app);

var invokedAsMain = require.main === module;

// Start server if not invoked by require('./app')
if (invokedAsMain) {
    http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on %s:%d in %s mode", config.address, config.port, app.settings.env);
    });
} else {
    // Export app if invoked by require('./app')
    module.exports = app;
}
