const router = require('express').Router();
const Document = require('../models/Document');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Create
router.post('/', auth, async (req, res) => {
  const doc = await Document.create({ ...req.body, owner: req.user.id });
  res.json(doc);
});

// Get all
router.get('/', auth, async (req, res) => {
  const docs = await Document.find({
    $or: [{ owner: req.user.id }, { collaborators: req.user.id }]
  });
  res.json(docs);
});

// Search
router.get('/search', auth, async (req, res) => {
  const results = await Document.find({ $text: { $search: req.query.q } });
  res.json(results);
});

// Get single
router.get('/:id', auth, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.json(doc);
});

// Update
router.put('/:id', auth, async (req, res) => {
  const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});

// Add collaborator by email
router.post('/:id/collaborators', auth, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { collaborators: user._id } },
      { new: true }
  );
  res.json(doc);
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only the owner can delete this document' });
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;