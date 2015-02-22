var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Twit = require('twit');
var heap = require('heap');

var screenName = 'arhythmetric';
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

var counted = 0;
var users = [];
var recursiveSearch = function(err, data, response){
  if (err) {
    console.log('search broken, count @ time=' + counted, '\nerror:\n', err);
    console.log('users array:', users);
    // setTimeout(recursiveSearch, 1000*60*16)
  } else {
    counted+= data.users.length;
    console.log('counted so far:', counted);
    //add tuple with user name & follower count to our users array
    users.push(data.users.map(function(item, index, array){
      return [item['screen_name'], item['followers_count']];
    }));
    console.log('users array:', users);
    // twit.get('followers/list', {screen_name: screenName, next_cursor: data['next_cursor_str']}, recursiveSearch);
  }
};




twit.get('followers/list', { screen_name: screenName },  recursiveSearch);

































module.exports = app;
