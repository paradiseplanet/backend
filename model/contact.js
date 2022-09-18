var mongoose = require('mongoose');
var Schema = mongoose.Schema;

contactSchema = new Schema( {
    message_id: Schema.ObjectId,
	name: String,
	email: String,
    mobile:String,
    messege:String
}),
contact = mongoose.model('contact', contactSchema);

module.exports = contact;