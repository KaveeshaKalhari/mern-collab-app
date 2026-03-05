const mongoose = require('mongoose');
const docSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// For full-text search
docSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Document', docSchema);