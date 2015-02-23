var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var transform = require('../transform');
var OAuth = require('oauth');

var screenName = process.env.SCREEN_NAME;
var THREE_MINUTES_IN_MS = 1000 * 60 * 3;
var app = express();

//Routes n whatnot

app.use(morgan('dev'));
app.use(bodyParser.json());

var oa = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWIT_CONSUMER_KEY,
  process.env.TWIT_CONSUMER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'

);

var lastCursor = -1;
var counted = 0;
var users = [];
var recursiveSearch = function(err, data, response){
  if (err) {
    console.log('search interrupted, count @ time=' + counted, '\nerror:\n', err);

    setTimeout(function(){
      console.log('attempting again, hopefully not still blocked');
      sendRequest();
    }, THREE_MINUTES_IN_MS);

    console.log('next round in 3 minutes from now,', new Date());

  } else {
    data = JSON.parse(data);
    counted+= data.ids.length;
    console.log('counted so far:', counted);
    lastCursor = data['next_cursor_str'];
    console.log('lastCursor:', lastCursor);
    //add tuple with user name & follower count to our users array
    users = users.concat(data.ids);

    if (lastCursor === '0') {
      // transform(users);
      console.log('end of users!!!');
    } else {
      sendRequest();
    }
  }
};



function sendRequest (){
  oa.get(
    'https://api.twitter.com/1.1/followers/ids.json?screen_name='+screenName+'&cursor='+lastCursor,
    process.env.TWIT_ACCESS_TOKEN,
    process.env.TWIT_TOKEN_SECRET,
    recursiveSearch
  );
};

sendRequest();















module.exports = app;
