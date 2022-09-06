var mongoose = require('mongoose');
var Schema = mongoose.Schema;

enquirySchema = new Schema( {
	name: String,
    email : String,
    pnone : String,
    message: Stringy,
	enquiry_id: Schema.ObjectId,
    business_id : String,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
enquiry = mongoose.model('enquiry', enquirySchema);
module.exports = enquiry;