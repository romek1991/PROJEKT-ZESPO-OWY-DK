var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Photo', new Schema({
  name: {type: String, maxlength: 50, required: true},
  filename: {type: String, maxlength: 200, required: true},
  trip: {type: mongoose.Schema.Types.ObjectId, ref: 'Trip'},
  createdDate: { type: Date, default: Date.now },
  description: {type: String, maxlength: 1000, required: false },
}));


