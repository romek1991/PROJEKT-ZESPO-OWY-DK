var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Trip', new Schema({
    name: {type: String, maxlength: 50, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdDate: { type: Date, default: Date.now },
    startDate: { type: Date, required: false, default: Date.now },
    endDate: { type: Date, required: false, default: Date.now },
    description: {type: String, maxlength: 10000, required: true },
    publicAccess: {type: Boolean, default: true }
}));


