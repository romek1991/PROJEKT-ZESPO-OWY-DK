var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Comment', new Schema({
  trip: {type: mongoose.Schema.Types.ObjectId, ref: 'Trip'},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  time: { type: Date, default: Date.now },
  text: {type: String, maxlength: 500, required: true }
}));