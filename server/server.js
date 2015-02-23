var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Twit = require('twit');
var transform = require('../transform');

var screenName = 'arhythmetric';
var SIXTEEN_MINUTES_IN_MS = 1000 * 60 * 16;
var app = express();

//Routes n whatnot

app.use(morgan('dev'));
app.use(bodyParser.json());

//twit stuff
var twit = new Twit({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token: process.env.TWIT_ACCESS_TOKEN,
  access_token_secret: process.env.TWIT_TOKEN_SECRET
});

var lastCursor;
var counted = 0;
var users = [];
var recursiveSearch = function(err, data, response){
  if (err) {
    console.log('search broken, count @ time=' + counted, '\nerror:\n', err);
    // console.log('users array:', users);

    setTimeout(function(){
      console.log('attempting again, hopefully not still blocked');
      twit.get('followers/list', {screen_name: screenName, next_cursor: lastCursor}, recursiveSearch);
    }, SIXTEEN_MINUTES_IN_MS);

    console.log('next round in 16 minutes from now,', new Date());

  } else {
    counted+= data.users.length;
    console.log('counted so far:', counted);
    lastCursor = data['next_cursor_str'];
    //add tuple with user name & follower count to our users array
    users = users.concat(data.users.map(function(item, index, array){
      return {handle: item['screen_name'], followers: item['followers_count']};
    }));

    if (lastCursor === 0) {
      transform(users);
    } else {
      twit.get('followers/list', {screen_name: screenName, next_cursor: data['next_cursor_str']}, recursiveSearch);
    }
  }
};




twit.get('followers/list', { screen_name: screenName },  recursiveSearch);

































module.exports = app;
