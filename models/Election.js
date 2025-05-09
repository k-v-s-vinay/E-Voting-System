const mongoose = require('mongoose');
const ElectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  candidates: [{ name: String, votes: { type: Number, default: 0 } }],
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
module.exports = mongoose.model('Election', ElectionSchema);
