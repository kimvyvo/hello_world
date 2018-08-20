const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = app.listen(8000);
const io = require('socket.io')(server);
app.use(express.static(__dirname + "/client/dist/client"));
app.use(bodyParser.json());

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);
app.all("*", (request ,response ,next) => {
    response.sendFile(path.resolve("./client/dist/client/index.html"))
});

io.on('connection', function(socket) {

});
