var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
    user_id: Schema.ObjectId,
	username: String,
	password: String
}),
user = mongoose.model('user', userSchema);

module.exports = user;