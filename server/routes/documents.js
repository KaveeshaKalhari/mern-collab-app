const router = require('express').Router();
const Document = require('../models/Document');
const auth = require('../middleware/authMiddleware');

// Create
router.post('/', auth, async (req, res) => {
  const doc = await Document.create({ ...req.body, owner: req.user.id });
  res.json(doc);
});

// Get all (owned + collaborated)
router.get('/', auth, async (req, res) => {
  const docs = await Document.find({
    $or: [{ owner: req.user.id }, { collaborators: req.user.id }]
  });
  res.json(docs);
});

// Full-text search
router.get('/search', auth, async (req, res) => {
  const results = await Document.find({ $text: { $search: req.query.q } });
  res.json(results);
});

// Update
router.put('/:id', auth, async (req, res) => {
  const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});

// Add collaborator
router.post('/:id/collaborators', auth, async (req, res) => {
  const doc = await Document.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { collaborators: req.body.userId } },
    { new: true }
  );
  res.json(doc);
});

module.exports = router;
