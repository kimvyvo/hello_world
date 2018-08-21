require('./user.js');

const SessionSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'Session title cannot be blank!'] },
    chat_content: {type: String, default: ''},
    users: [UserSchema]
}, {timestamps: true});
mongoose.model('Session', SessionSchema);
Session = mongoose.model('Session');
