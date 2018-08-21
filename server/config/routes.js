const sessions = require('../controllers/sessions.js');
const users = require('../controllers/users.js');

module.exports = function(app) {

    // Sessions API
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

    // Users API
    app.get('/users/:id', function(req, res) {
        users.one(req, res)
    });
    app.post('/users/:id', function(req, res){
        users.create(req, res);
    });
    app.put('/users/:sid', function(req, res) {
        users.arr_pull(req, res);
    });
    app.delete('/users/:id/:sid', function(req, res) {
        users.remove(req, res);
    });
}