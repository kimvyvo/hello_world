mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hello_world')
mongoose.Promise = global.Promise;