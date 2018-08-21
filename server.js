var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
app.use(express.static(__dirname + "/client/dist/client"));
app.use(bodyParser.json());

// require('./server/config/mongoose.js');
// require('./server/config/routes.js')(app);

app.all("*", (request ,response ,next) => {
    response.sendFile(path.resolve("./client/dist/client/index.html"))
});
app.listen(8000);