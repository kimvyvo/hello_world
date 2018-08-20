// require('./user.js');

const SessionSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'Session title cannot be blank!'] },
}, {timestamps: true});
mongoose.model('Session', SessionSchema);
Session = mongoose.model('Session');
