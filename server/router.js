/* this will be our router for our express server */
var mongoose = require('mongoose');
var Guest = require('../app-db/guests/guestModel');
var User = require('../app-db/users/userModel');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var DiningTable = require('../app-db/diningTbl/diningTblModel');
var algo = require('./utils/diningTableAlgo');

module.exports = function(app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../client'));

  // app.get('/', function(req, res) {
  //   res.send('Hellooooo WOOOOOORLD!!!!');
  // });

////////////////////////////////////////////////////////
//                 AUTHENTICATION                     //
////////////////////////////////////////////////////////

// SIGN UP USER
// this is callback system, should refactor to promises
  app.post('/user/signup', function(req, res) {
    console.log('signup begins');
    // check to see if the username already exists:
    // .count is a method that passes an err and number into a callback
    // the number is the number of items in the table that match the
    // object passed in as the first argument.
    User.count({username: req.body.username}, function(err, num) {
      // error querying database
      if (err) {
        console.log(new Error(err));
        res.end();
      } else {
        if (num > 0) {
          // no error saving, but there's already a user
          res.end('That username is already taken. Try again, please.');
        } else {
          // no user, free to proceed
          var newUser = new User({
            username: req.body.username,
            password: req.body.password
          });
          newUser.save(function(err, user) {
            //if there's an error saving
            if (err) {
              console.log(new Error(err));
              res.end(err);
            } else {
              // otherwise, start session...
              // redirection is taken care of on client-side
              console.log('successfully saved new user');
              res.end('new user successfully saved');
            }
          }); // end of save
        }
      }
    }); // end of count
  }); // end of post to signup

  // SIGN IN USER
  app.post('/user/signin', function(req, res) {
    console.log('signin begins with', req.body);
    // check to make sure the user exists
    return User.findOne({username: req.body.username}, function(err, user) {
      if (err) {
        console.log(71, new Error(err));
        res.end();
        return;
      } else {
        // check the salted passwords
        if (!user) {
          res.end('no match for username');
          return;
        } else {
          user.comparePassword(req.body.password)
            .then(function(isMatch) {
              if (!isMatch) {
                res.end('wrong password; please try again');
              } else {
                // TODO: here we'll need to pass 'resp' back to the signin
                // auth services, but I'm unsure what 'resp' is, so I'm just
                // passing along the boolean.
                return(isMatch);
              }
            })
            .catch(function(err) {
              console.log(90, err);
              res.end(err);
              return;
            });
          res.end('completed post to signin');
        } 
      }
    }); // end of findOne
  }); // end post to signin

  // developer-centered route to get all users in database
  app.get('/user/signup', function(req, res) {
    User.find({}, function(err, users) {
      if (err) console.log(err);
      res.end(JSON.stringify(users));
    });
  });

////////////////////////////////////////////////////////
//                     GUEST INFO                     //
////////////////////////////////////////////////////////

// client-side posts a list of guests
  app.post('/create', function(req, res) {
    console.log('------------------------------');
    console.log(req.body.guests[0]);
    // console.log(req.body.guests);
    console.log('------------------------------');
    var guests = req.body.guests;
    for(var i =0; i<guests.length;i++){
      var newGuest = new Guest ({
        guestName: guests[i].guestName,
        friendName: guests[i].friendName,
        constraints: guests[i].constraints
      });
      newGuest.save(function(err,newGuest){
        if(err) return console.log(err);
        console.log('//////WE\'RE SAVING OMG!!! CRAZY !!!! ')
      });
    }
    res.send(200);
  });

  // This will use the sorting algorithm to arrange the list of guests into multiple dining tables
  // Client will pass in numPerTable
  app.post('/tables/sort', function(req, res) {
    // remove current diningTables
    DiningTable.find().remove(function(err) {
      if (err) return console.log(err);
    });
    // expecting client to pass in a numPerTable
    var numPerTable = req.body.numPerTable;
    Guest.find(function(err, guests) {
      var diningTables = algo.makeDiningTables(guests, numPerTable);
      // loop through diningTables
      diningTables.forEach(function(diningTable, index) {
        var dt = new DiningTable({
          diningTableName: index,
          guestsAtTable: diningTable
        });
        dt.save(function(err, table) {
          if (err) {
            res.send(400);
          } else {
            console.log('Saved dining table');
            res.send(200);
          }
        });
      });
    });
  });

  // returns a matrix of dining tables (an array of arrays; the nested
  // arrays are the dining tables, full of guest objects)
  app.get('/tables/get', function(req, res) {
    DiningTable.find(function(err, diningTables) {
      if (err) return console.log(err);
      //console.log(diningTables);
      console.log(170, 'diningTables gotten');
      if (!!diningTables) {
        res.send(200, diningTables);
      } else {
        res.send(404);
      }
    });
  });

//retrieves all guests
  app.get('/create', function(req, res){
    Guest.find(function(err, guests){
      if(err) return console.log(err);
      //console.log(guests);
      console.log(184, 'guests gotten');
      if(guests) {
        res.send(200, guests);
      } else {
        res.send(404);
      }
    });
  });

// edit guest properties
  app.put('/create', function(req, res){
    var changes = req.body.changes;
    console.log('-------------->', changes);
    // test object: { "changes": [ "Jennie Kim", { "guestName": "JK", "friendName": "Eric"} ]}
    Guest.findOne({ guestName: changes[0]}, function(err, guest){
      console.log("inside findOne", 197, guest);
      if(err){
        // if there's an error
        console.log(202, err);
        res.send(400);
      } else if (!guest) {
        // if the guest hasn't been found
        console.log(206, 'no guest');
        res.send(500);
      } else {
        for(var key in changes[1]) {
          guest[key] = changes[1][key];
        }
        guest.save(function(err){
          if(err) {
            res.send(400);
          } else {
            res.send(200);
          }
        });
      }
    });
  });

  // drop guests
  app.post('/users/clear', function(req, res) {
    Guest.find().remove(function(err) {
      if (err) return console.log(err);
      res.send(200);
    });
  });

////////////////////////////////////////////////////////
//                  EVERYTHING ELSE                   //
////////////////////////////////////////////////////////

// wildcard route
  app.get('*', function(req, res){
    res.end('404 Not Found');
  });

}; // end export


// detect the url route
// read the data
// post to the database



// Add guests
// Add relationships (+1s)
// Add constraints ('enemies')

/* example objects for tests

Note: in Postman when doing a 'POST', it's important to input in the body by selection the 'raw' option and
using a json format like so:
{"guests":[{"guestName":"marco","friendName":"Lambert", "constraints":[]}]}


these are not valid syntax for postman
{guests:[{guestName:'marco',friendName:'Lambert'},{guestName:'Lambert',friendName:'marco'},{guestName:'Kiri'}]}
[{guestName:'marco',friendName:'Lambert'},{guestName:'Lambert',friendName:'marco'},{guestName:'Kiri'}]
[{guestName:'marco',friendName:'Lambert', constraints:[]}]
*/
