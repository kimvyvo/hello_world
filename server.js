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
    console.log('Connection established!');

    socket.on('new_user', function(data){
        console.log('Socket connect')
        socket.id = data.id;
        socket.sid = data.sid;
    });
    socket.on('disconnect', function(){
        console.log('Socket disconnect');
        User.findOneAndRemove({_id: socket.id}, function(err){
            if(err){
                console.log('Something went wrong when removing a user', err);
            }else{
                Session.findByIdAndUpdate({_id: socket.sid}, {$pull: {users: {_id: socket.id}}}, function(err, data) {
                    if(err){
                        console.log('Something went wrong when removing a user from session', err);
                    }else{
                        Session.findOne({_id: socket.sid}, function(err, session){
                            if(err){
                                console.log('Something went wrong when getting a single session');
                            }else{
                                if(session.users.length === 0){
                                    Session.findOneAndRemove({_id: socket.sid}, function(err){
                                        if(err){
                                            console.log('Something went wrong when removing a session');
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    });
    socket.on('init_text', function(){
        socket.emit('receive_text');
    });
    socket.on('send_text', function(){
        io.emit('receive_text');
    });
});
