var Heap = require('heap');
var Stream = require('stream');
var fs = require('fs');
var jsoncsv = require('json-csv');

module.exports = function(users){
  var hp = new Heap(function(a,b){
    return b.followers - a.followers;
  });

  while(users.length) {
    hp.push(users.pop());
  }

  var readStream = new Stream.Readable({objectMode: true});
  readStream._read = function(){
    var temp = hp.pop();
    if (temp === undefined) {
      readStream.push(null);
    } else {
      readStream.push(temp);
      // console.log(temp.toString());
    }
  };


  var csvOptions = {
    fields: [{
      name: 'handle',
      label: 'Handle',
      quoted: true
    }, {
      name: 'followers',
      label: 'Number of Followers'
    }]
  };

  var output = fs.createWriteStream('output.csv', {encoding: 'utf8'});
  readStream.pipe(jsoncsv.csv(csvOptions)).pipe(output);
  output.on('finish', function(){
    console.log('Finished writing to csv.');
  });
};





