require('../models/user.js');
require('../models/session.js');

module.exports = {
    one: function(req, res){
        User.findOne({_id: req.params.id}, function(err, user){
            if(err){
                console.log('Something went wrong when getting a single user');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: user});
            }
        });
    },
    create: function(req, res){
        User.create(req.body, function(err, user){
            if(err){
                console.log('Something went wrong when creating a user.', err);
                res.json({message: 'Error', error: err});
            }
            else{
                Session.findByIdAndUpdate({_id: req.params.id}, {$push: {users: user}}, function(err){
                    if(err){
                        console.log('Something went wrong when adding a user to a session.', err);
                        res.redirect('/users/' + user._id);
                    }else{
                        res.redirect('/users/' + user._id);
                    }
                });
            }
        });
    },
    remove: function(req, res){
        User.findOneAndRemove({_id: req.params.id}, function(err, user){
            if(err){
                console.log('Something went wrong when removing a user');
                res.json({message: 'Error', error: err});
            }else{
                Session.findByIdAndUpdate({_id: req.params.sid}, {$pull: {users: {_id: req.params.id}}}, function(err, data) {
                    if(err){
                        console.log('Something went wrong when removing a user from session');
                        res.json({message: 'Error', error: err});
                    }else{
                        console.log('came here', data);
                        res.json({message: 'Success', data: data});
                    }
                });
            }
        });
    }
}