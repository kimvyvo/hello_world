const sessions = require('../controllers/sessions.js');
const users = require('../controllers/users.js');

module.exports = function(app) {
    app.get('/sessions', function(req, res) {
        sessions.all(req, res);
    });
    app.get('/sessions/:id', function(req, res) {
        sessions.one(req, res);
    });
    app.post('/sessions', function(req, res) {
        sessions.create(req, res);
    });
    app.put('/sessions/:id', function(req, res) {
        sessions.update(req, res);
    });
    app.delete('/sessions/:id', function(req, res) {
        sessions.remove(req, res);
    });
    app.post('/users/:id', function(req, res){
        users.create(req, res);
    });
}