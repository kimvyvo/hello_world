// require('../models/user.js');
// require('../models/session.js');

// module.exports = {
//     create: function(req, res){
//         User.create(req.body, function(err, review){
//             if(err){
//                 console.log('Something went wrong when creating a user.', err);
//                 res.json({message: 'Error', error: err});
//             }
//             else{
//                 Session.findByIdAndUpdate({_id: req.params.id}, {$push: {reviews: review}}, function(err){
//                     if(err){
//                         console.log('Something went wrong when adding a user to a session.');
//                         res.redirect('/sessions');
//                     }else{
//                         res.redirect('/sessions');
//                     }
//                 });
//             }
//         });
//     }
// }