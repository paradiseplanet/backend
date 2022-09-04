var mongoose = require('mongoose');
var Schema = mongoose.Schema;

businessSchema = new Schema( {
	name: String,
	desc: String,
	price: Number,
	image: String,
	discount: Number,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
business = mongoose.model('business', businessSchema);

module.exports = business;