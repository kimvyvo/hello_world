require('../models/session.js');

module.exports = {
    all: function(req, res){
        Session.find({}).sort('createdAt').exec(function(err, sessions){
            if(err){
                console.log('Something went wrong when getting all sessions');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: sessions});
            }
        });
    },
    one: function(req, res){
        Session.findOne({_id: req.params.id}, function(err, session){
            if(err){
                console.log('Something went wrong when getting a single session');
                res.json({message: 'Error', error: err});
            }else{
                res.json({message: 'Success', data: session});
            }
        });
    },
    create: function(req, res){
        Session.create(req.body, function(err){
            if(err){
                console.log('Something went wrong when creating a session, detail: ', err);
                res.json({message: 'Error', error: err});   
            }else{
                res.redirect('/sessions');
            }
        });
    },
    update: function(req, res){
        Session.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, { runValidators: true }, function(err){
            if(err){
                console.log('Something went wrong when updating a session, detail: ', err);
                res.json({message: 'Error', error: err});
            }else{
                res.redirect(303, '/sessions');
            }
        });
    },
    remove: function(req, res){
        Session.findOneAndRemove({_id: req.params.id}, function(err){
            if(err){
                console.log('Something went wrong when removing a session');
                res.json({message: 'Error', error: err});
            }else{
                Session.find({}, function(err, sessions){
                    if(err){
                        console.log('Something went wrong when getting all sessions');
                        res.json({message: 'Error', error: err});
                    }else{
                        res.json({message: 'Success', data: sessions});
                    }
                });
            }
        });
    },
}