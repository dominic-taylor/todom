var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');

app.set('port', 3000);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res){
  res.redirect('client/index.html')
})

app.get('/api/v1/tasks', function (req, res) {
  fs.readFile('data/db.json', 'utf8', function (err, data){
      if (err) throw err
      res.json(data)
    }
  )
})

app.post('/api/v1/save', function (req, res){
  var tasks = JSON.stringify(req.body)

    fs.writeFile('data/db.json', tasks, 'utf-8', function (err){
    if (err) throw err
    console.log('tasks saved')
  })
})


var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server is up on port '+port);
});
