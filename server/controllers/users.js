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
    }
}