/* 

WARNING: UNFINISHED.
-It appears that twitter has some anti-crawling strategies implemented and bulk requests get throttled. Therefore, I have stopped working on this approach.

*/


var trumpet = require('trumpet');
// var request = require('request');
var hyperquest = require('hyperquest');
var Readable = require('stream').Readable;
var tr = trumpet();
// process.stdout.setMaxListeners(0);

module.exports = function(users) {
  
  var count = 0;
  while (count < 5) {
    var path = 'https://twitter.com/intent/user?user_id='+users.pop();
    var tr = trumpet();
    tr.select('body', function(body){
      // console.log(body);
      console.log(body);
      // followersEle.createReadStream().pipe(process.stdout);
    });
    // console.log(path);
    var req = hyperquest(path);
    req.pipe(tr, {end: false});
    count++;

  }
  

}

// var hq = hyperquest('https://twitter.com/intent/user?user_id=111165380');
// hq.on('response', function(res){console.log(res);});
// hq.on('error', function(err){console.log(err);});
// hq.pipe(process.stdout, {end: false});
  // request('https://twitter.com/intent/user?user_id=111165380').pipe(tr);
