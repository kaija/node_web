/*
 * --------------------------------------------------------
 * Enviornment setup
 * --------------------------------------------------------
 */
var express = require('express');
var https = require('https');
var fs = require('fs');
var dotenv = require('dotenv');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodoverride = require('method-override');
dotenv.load();
HTTP_PORT=process.env.http_port;
HTTPS_PORT=process.env.https_port;

SERVICE_PREFIX='/rest';
MISSING_PARAM='Missing parameter';
var ENABLE_DEBUG = true;
var log_path='/var/log/node_web'

/*
 * --------------------------------------------------------
 * Setup server log
 * --------------------------------------------------------
 */
if(!fs.existsSync(log_path)){
  console.log("Log folder not exist, create it.\n");
  fs.mkdirSync(log_path, 0775, function(err){
    if(err){
      console.log("Log folder create failure.\n");
    }
  });
}
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: log_path + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: log_path + '/exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;
var time = new Date();

logger.info("Server start at " + time + " with HTTP(" + HTTP_PORT +") HTTPS(" + HTTPS_PORT +")" );

/*
 * --------------------------------------------------------
 * Database Setup
 * --------------------------------------------------------
 */

/*
 * --------------------------------------------------------
 * Oauth Setup
 * --------------------------------------------------------
 */

/*
 * --------------------------------------------------------
 * Server main
 * --------------------------------------------------------
 */

var register = function(app, passport){
  app.use(bodyparser.urlencoded({
    extended: true
  }));
  app.use(bodyparser.json());
  app.use(cookieParser());

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });
/*
 * ==================================================
 *             Root page
 * ==================================================
 */
  app.get('/', function(req, res){
    //console.log("[" + JSON.stringify(req.user) + "]");
    //res.send(200, "Hello " + req.user.displayName);
    res.send(200);
  });
  app.post(SERVICE_PREFIX + '/login', function(){
    res.send(200);
  });
};

var http = express();
register(http);
http.listen(HTTP_PORT);

var options = {
  key: fs.readFileSync(__dirname + "/ssl.key"),
  cert: fs.readFileSync(__dirname + "/ssl.cert")
};
https.createServer(options, http).listen(HTTPS_PORT);
