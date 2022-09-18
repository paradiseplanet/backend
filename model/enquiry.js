var mongoose = require('mongoose');
var Schema = mongoose.Schema;

enquirySchema = new Schema( {
	enquiry_id: Schema.ObjectId,
	name: String,
    email : String,
    pnone : String,
    message: String,
    business_id : String,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
enquiry = mongoose.model('enquiry', enquirySchema);
module.exports = enquiry;