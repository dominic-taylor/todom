var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'client')));

app.get('/api/v1/tasks', function (req, res) {
  fs.readFile('data/db.json', 'utf8', function (err, data){
      if (err) throw err
      res.json(data)
    }
  )
})

app.post('/api/v1/save', function (req, res){
  console.log('post hooked to route')
  // fs.writeFile('data/db.json', tasks.json, function (err){
  //   if (err) throw err
  //   console.log('tasks saved')
  // })
})


var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server is up on port '+port);
});
