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

let connected_counter = 0;
// const video_srcs = [];
io.on('connection', function(socket) {
    console.log('Connection established!');

    socket.on('connect', function(){
        connected_counter++;
    });
    socket.on('disconnect', function(){
        connected_counter--;
    });
    socket.on('init_text', function(){
        socket.emit('receive_text');
    });
    socket.on('send_text', function(){
        io.emit('receive_text');
    });

    // socket.on('send_video', function(data){
    //     connected_counter++;
    //     video_srcs.push(data.video);
    //     for (var src in video_srcs) {
    //         socket.emit('receive_video', {video: src, count: connected_counter});
    //     }
    // });
});
