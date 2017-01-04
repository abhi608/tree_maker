var express = require('express');
var app = express();
var fs = require("fs");
var path=require("path");
var mysql      = require('mysql');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var connection = mysql.createConnection({
    host     : 'dev.sharechat.co',
    user     : 'amit',
    password : 'vePRDNtVZ5jzZyqm',
    database    : 'login'
});

app.use(function(req, res, next) {
    var auth;

    // check whether an autorization header was send    
    if (req.headers.authorization) {
      // only accepting basic auth, so:
      // * cut the starting "Basic " from the header
      // * decode the base64 encoded username:password
      // * split the string at the colon
      // -> should result in an array
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
      console.log(auth);
    }

    // checks if:
    // * auth array exists 
    // * first value matches the expected user 
    // * second value the expected password
    if(auth){
      var query = 'SELECT * from users where username = \"' + auth[0] + '\"';
      console.log(query);

      connection.query(query, function(err, user) {
          console.log('inside connection');
          console.log(user);
          if(user == undefined){
              res.statusCode = 401;


              // MyRealmName can be changed to anything, will be prompted to the user
              res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
              // this will displayed in the browser when authorization is cancelled
              res.end('Unauthorized');
            
          }else{
            user = user[0];  
          }
          
          if (!auth || auth[0] !== user.username || auth[1] !== user.password) {
              // any of the tests failed
              // send an Basic Auth request (HTTP Code: 401 Unauthorized)
              res.statusCode = 401;


              // MyRealmName can be changed to anything, will be prompted to the user
              res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
              // this will displayed in the browser when authorization is cancelled
              res.end('Unauthorized');
          }
           else {
          //     // continue with processing, user was authenticated
          //     console.log('username is :');
          //     console.log(user);
          //     console.log('printing session');
          //     // req.session["s_username"] = user.username;
          //     // req.session["s_userid"] = user.id;
          //     console.log("REQ:  ",req);
          //     req.session.s_username = user.username;
          //     req.session.s_userid = user.id;

          //     // s_username = user.username;
          //     // s_userid = user.id;
          //     req.session.user_id = user.id;
          //     console.log(req.session);
               next();
           }
          
            
      });  
    }else{
        res.statusCode = 401;
        // MyRealmName can be changed to anything, will be prompted to the user
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        // this will displayed in the browser when authorization is cancelled
        res.end('Unauthorized');

    }
    
    
});

app.use('/',express.static('./public/')); 

app.get('/dance.json', function (req, res) {  //get api for dance.json. Available at localhost:3007/dance.json
   fs.readFile( path.join(__dirname +'/dance.json'), 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

var server = app.listen(8200, function () {   //server defined

  var host = server.address().address;
  var port = server.address().port;

  console.log("app listening at http://%s:%s", host, port)

})


