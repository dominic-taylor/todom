var express = require('express');
var app = express();
var path = require('path');

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'client')));

app.get('/api/v1/tasks', function (req, res) {
  res.json({tasks:["Take out the rubbish", "Make dinner", "Take in washing"]})
})


var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server is up on port '+port);
});
