UserSchema = new mongoose.Schema({
    name: {type: String, default: '', required: [true, 'Name cannot be blank!'], minlength: [2, 'Name must be at least 2 characters long!']},
    role: {type: String, default: 'user' },
}, {timestamps: true});
mongoose.model('User', UserSchema);
User = mongoose.model('User');