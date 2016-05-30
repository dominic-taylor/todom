var express = require('express');
var app = express();

app.set('port', 3000);

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server is up on port '+port);
});
