var express = require('express');
var cors = require('cors')
module.exports =  startREST;

var whitelist = [ 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    //console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback('Not allowed by CORS',false)
    }
  }
}

function startREST(){
  var app = express();
  app.use(cors());

  //app.use(express.json());

  /*
  app.post('/', function (req, res) {
    //res.sendFile('test.zip');
    res.end( JSON.stringify({message:'Nevyplnené všetky položky.'}) );
  });*/

  app.get('/', (req, res) =>{
    res.sendFile('test.zip', { root: __dirname });
  })

  app.listen(8081, () => console.log(`Express listening on port 8081!`))
}
startREST();
