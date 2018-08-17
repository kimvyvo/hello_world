var express = require('express');
var app = express();
app.use(express.static(__dirname + "/client/dist/client"));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var path = require('path');
// require('./server/config/mongoose.js');
// require('./server/config/routes.js')(app);
app.all("*", (request ,response ,next) => {
    response.sendFile(path.resolve("./client/dist/client/index.html"))
});
app.listen(8000);