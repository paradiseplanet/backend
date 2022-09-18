var mongoose = require('mongoose');
var Schema = mongoose.Schema;

businessSchema = new Schema( {
	name: String,
	logo:{name: String,
		desc: String,
		img:
		{
			data: Buffer,
			contentType: String
		}},
	desc: String,
	address: String,
	latitude:String,
	logitude:String,
	Mobile: String,
	email: Number,
	website:String,
	facebook:String,
	instagram:String,
	twitter:String,
	descImages:Array,
	descVideos:Array,
	ourServices:Array,
	ourHighlights:Array,
	ourPackeges:Array,
	ourGallery:Array,
	business_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
business = mongoose.model('business', businessSchema);

module.exports = business;